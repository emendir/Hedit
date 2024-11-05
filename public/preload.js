const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    onFileOpened: (callback) => ipcRenderer.on('file-opened', (event, content) => callback(content)),
    saveFile: (data) => ipcRenderer.send('save-file', data),
    // saveFile: (filePath, content) => ipcRenderer.send('write-file', { filePath, content }),
    // openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
    // readFile: (filePath) => ipcRenderer.invoke('read-file', filePath), // Use IPC for reading file
    // onSaveResponse: (callback) => ipcRenderer.on('write-file-response', callback),
    // onMenuChooseFile: (callback) => ipcRenderer.on('menu-choose-file', callback)
});
