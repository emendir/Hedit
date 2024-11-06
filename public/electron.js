const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let currentFilePath = '';
let editorContent = '';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            enableRemoteModule: false,
        },
    });

    // mainWindow.loadURL('http://localhost:3000'); // or load your index.html
    mainWindow.loadFile(path.join(__dirname, '..','build', 'index.html'));
}

// Function to create a menu with "Choose File" added to the default File menu
function createMenu() {
    const isMac = process.platform === 'darwin';

    const defaultMenu = Menu.buildFromTemplate([
        ...(isMac ? [{ role: 'appMenu' }] : []),
        {
            label: 'File',
            submenu: [
                {
                    label: 'New',
                    accelerator: process.platform === 'darwin' ? 'Cmd+N' : 'Ctrl+N',
                    click: async () => {
                        await createNewFile();
                    },
                },
                {
                    label: 'Open...',
                    accelerator: process.platform === 'darwin' ? 'Cmd+O' : 'Ctrl+O',
                    click: async () => {
                        const filePath = await showOpenDialog();
                        if (filePath) {
                            await loadFile(filePath);
                        }
                    },
                },
                {
                    label: 'Save',
                    accelerator: process.platform === 'darwin' ? 'Cmd+S' : 'Ctrl+S',
                    click: async () => {
                        if (!currentFilePath) {
                            const result = await dialog.showSaveDialog({
                                title: 'Save File',
                                filters: [{ name: 'Text Files', extensions: ['txt', 'html'] }]
                            });
                            
                            if (!result.canceled && result.filePath) {
                                // Check if file exists
                                if (fs.existsSync(result.filePath)) {
                                    const choice = await dialog.showMessageBox({
                                        type: 'question',
                                        buttons: ['Overwrite', 'Cancel'],
                                        defaultId: 1,
                                        title: 'File Already Exists',
                                        message: 'The file already exists. Do you want to overwrite it?'
                                    });
                                    if (choice.response === 1) { // User clicked Cancel
                                        currentFilePath='';
                                        return;
                                    }
                                }
                                currentFilePath = result.filePath;
                                await saveContentToFile();
                            }
                        } else {
                            await saveContentToFile();
                        }
                    },
                },
                { type: 'separator' },
                ...(isMac ? [{ role: 'close' }] : [{ role: 'quit' }]),
            ],
        },
        { role: 'editMenu' },
        { role: 'viewMenu' },
        { role: 'windowMenu' },
        ...(isMac ? [{ role: 'help' }] : []),
    ]);

    Menu.setApplicationMenu(defaultMenu);
}

async function showOpenDialog() {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt', 'html'] }],
    });
    return result.filePaths[0]; // Return the selected file path
}

async function readFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data); // Resolve the content of the file
            }
        });
    });
}

async function saveContentToFile() {
    if (currentFilePath) {
        try {
            await fs.promises.writeFile(currentFilePath, editorContent);
            console.log('File saved successfully');
        } catch (err) {
            console.error('Failed to save file:', err);
        }
    } else {
        console.warn('No file path specified for saving.');
    }
}

// IPC handler to save the file
ipcMain.on('save-file', (event, data) => {
    editorContent=data;
    saveContentToFile();
});

// Add this new function
async function loadFile(filePath) {
    const fileContent = await readFile(filePath);
    
    if (!fileContent) {
        currentFilePath = filePath;
        // If file is empty, write the current editor content to it
        if (editorContent) {
            await fs.promises.writeFile(filePath, editorContent);
            BrowserWindow.getFocusedWindow().webContents.send('file-opened', editorContent);
        }
    } else if (!editorContent) {
        // If editor is empty, load the file content
        currentFilePath = filePath;
        editorContent=fileContent;
        BrowserWindow.getFocusedWindow().webContents.send('file-opened', fileContent);
    } else if (editorContent !== fileContent) {
        if (!currentFilePath){

            // If both have different content, ask user what to do
            const choice = await dialog.showMessageBox({
                type: 'question',
                buttons: ['Load File', 'Cancel'],
                defaultId: 0,
                title: 'Unsaved Changes',
                message: 'You have unsaved changes in the editor. Do you want to discard them and load the file?'
            });
            if (choice.response === 0) {  // User clicked "Load File"
                currentFilePath = filePath;
                editorContent=fileContent;
                BrowserWindow.getFocusedWindow().webContents.send('file-opened', fileContent);
            }
            // If user clicked Cancel, do nothing
        } else {
            saveContentToFile();
            editorContent=fileContent;
            currentFilePath = filePath;
            BrowserWindow.getFocusedWindow().webContents.send('file-opened', fileContent);
        }
    } else {
        // Contents are the same, just load the file
        currentFilePath = filePath;
        BrowserWindow.getFocusedWindow().webContents.send('file-opened', fileContent);
    }
}

async function createNewFile() {
    const result = await dialog.showSaveDialog({
        title: 'Create New File',
        filters: [{ name: 'Text Files', extensions: ['txt', 'html'] }]
    });
    
    if (!result.canceled && result.filePath) {
        // Check if file exists
        if (fs.existsSync(result.filePath)) {
            const choice = await dialog.showMessageBox({
                type: 'question',
                buttons: ['Overwrite', 'Cancel'],
                defaultId: 1,
                title: 'File Already Exists',
                message: 'The file already exists. Do you want to overwrite it?'
            });
            if (choice.response === 1) { // User clicked Cancel
                return;
            }
        }
        await fs.promises.writeFile(result.filePath, '');
        await loadFile(result.filePath);
    }
}

app.whenReady().then(() => {
    createMenu(); // Set up the menu when app is ready
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
