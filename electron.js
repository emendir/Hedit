const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    win.loadURL('http://localhost:3000'); // Adjust as necessary
}

// Handle file dialog open request
ipcMain.handle('open-file-dialog', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'Text Files', extensions: ['txt', 'html'] }]
    });
    if (canceled) return null;
    return filePaths[0]; // Return the selected file path
});

// Handle read file request
ipcMain.handle('read-file', async (event, filePath) => {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content; // Return the file content
    } catch (error) {
        console.error("Failed to read file:", error);
        return null;
    }
});

// Handle write file request
ipcMain.on('write-file', (event, { filePath, content }) => {
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error("File write failed:", err);
            event.reply('write-file-response', { success: false, error: err.message });
        } else {
            console.log("File written successfully:", filePath);
            event.reply('write-file-response', { success: true });
        }
    });
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
