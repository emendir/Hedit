const { app, BrowserWindow } = require('electron');
const path = require('path');

async function createWindow() {
    const isDev = (await import('electron-is-dev')).default;

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    // Load localhost in development or static files in production
    const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build', 'index.html')}`;
    win.loadURL(startURL);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
