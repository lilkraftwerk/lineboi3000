const undo = mainWindow => {
    mainWindow.webContents.send('keystroke:undo');
};

module.exports = {
    undo
};
