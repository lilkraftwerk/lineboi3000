const { dialog } = require('electron');
const fs = require('fs-jetpack');

const showOpenDialog = (mainWindow) => {
    const options = {
        title: 'Load a saved project',
        // defaultPath: '/path/to/something/',
        buttonLabel: 'Load',
        filters: [{ name: 'lineboi projects', extensions: ['boi'] }],
        properties: ['openFile'],
        message: 'Open a lineboi project'
    };

    dialog.showOpenDialog(null, options, (filePath) => {
        const path = filePath[0];
        const reduxStore = fs.read(path, 'json');
        mainWindow.send('menu:onOpenProjectSelect', reduxStore);
    });
};

const showSaveDialog = () => {
    const options = {
        title: 'Save current project',
        defaultPath: 'lineboiProject',
        buttonLabel: 'Save',
        filters: [{ name: 'lineboi projects', extensions: ['boi'] }],
        message: 'Save your lineboi project'
    };

    dialog.showSaveDialog(null, options, (filePath) => {
        if (!filePath || !global.reduxStore) {
            console.log('no file path or redux store in main');
            return;
        }

        try {
            fs.write(filePath, JSON.stringify(global.reduxStore));
        } catch (e) {
            console.log('failed to save');
            console.log(e);
        }
        console.log('complete save');
    });
};

module.exports = {
    showOpenDialog,
    showSaveDialog
};
