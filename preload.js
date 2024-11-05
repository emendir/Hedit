const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    saveFile: (filePath, content) => ipcRenderer.send('write-file', { filePath, content }),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath), // Use IPC for reading file
    onSaveResponse: (callback) => ipcRenderer.on('write-file-response', callback)
});
