const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

let currentFilePath = '';

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

    mainWindow.loadURL('http://localhost:3000'); // or load your index.html
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
                    label: 'Open...',
                    click: async () => {
                        const filePath = await showOpenDialog();
                        if (filePath) {
                            currentFilePath = filePath; // Store the file path
                            const fileContent = await readFile(filePath); // Read the file content
                            // Send the content to App.js
                            BrowserWindow.getFocusedWindow().webContents.send('file-opened', fileContent);
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

// IPC handler to save the file
ipcMain.on('save-file', (event, data) => {
    if (currentFilePath) {
        fs.writeFile(currentFilePath, data, (err) => {
            if (err) {
                console.error('Failed to save file:', err);
            } else {
                console.log('File saved successfully');
            }
        });
    } else {
        console.warn('No file path specified for saving.');
    }
});

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
