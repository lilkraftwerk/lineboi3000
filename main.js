const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const fs = require('fs-jetpack');
const base64ImageToFile = require('base64image-to-file');

let onProd = false;
if (process.argv[2] && process.argv[2] === 'true') {
    onProd = true;
}

const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS
} = require('electron-devtools-installer');

const debugBackgroundWindow = false;
const cpus = debugBackgroundWindow ? 1 : require('os').cpus().length;

console.log(`num available cpus: ${cpus}`);

const testEnv = process.env.NODE_ENV === 'test';

let win;
// stack of available background threads
let available = [];

// queue of tasks to be done
const tasks = [];

const backgroundWindows = [];

require('./src/mainProcess/presetManager');
require('./src/mainProcess/drawingManager');
const menuTemplateGenerator = require('./src/mainProcess/appMenu');
const { showSaveDialog } = require('./src/mainProcess/SaveAndLoad');

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 850,
        backgroundColor: '#FFF',
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        resizable: false,
        show: testEnv
    });

    // run web server from here
    const mainUrl = `file://${__dirname}/dist/index.html`;
    win.loadURL(mainUrl);

    if (!testEnv && !onProd) {
        win.webContents.once('dom-ready', () => {
            win.webContents.openDevTools();
        });
    }

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('did-finish-load', () => {
        win.show();
    });

    const menu = Menu.buildFromTemplate(menuTemplateGenerator(win));
    Menu.setApplicationMenu(menu);
    if (!onProd) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then((name) => {
                console.log(`Added Extension:  ${name}`);
            })
            .catch((err) => {
                console.log('An error occurred: ', err);
            });
    }

    return win;
}

function performTasks() {
    while (available.length > 0 && tasks.length > 0) {
        const [message, payload] = tasks.shift();
        const availableBgWindow = available.shift();
        availableBgWindow.send(message, payload);
    }
}

function createBgWindow() {
    const result = new BrowserWindow({
        show: debugBackgroundWindow,
        webPreferences: {
            nodeIntegration: true
        }
    });
    const url = `file://${__dirname}/dist/background.html`;
    result.loadURL(url);
    result.on('closed', () => {
        console.log('background window closed');
    });

    console.group('creating background window');
    if (debugBackgroundWindow) {
        // result.webContents.openDevTools();
    }

    return result;
}

app.on('ready', () => {
    createWindow();
    for (let i = 0; i < cpus; i += 1) {
        backgroundWindows.push(createBgWindow());
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const reloadBackgroundWindows = () => {
    console.log('reloading background windows...');
    backgroundWindows.forEach((window) => {
        console.log('closing window...');
        window.close();
    });
    available = [];
    for (let i = 0; i < cpus; i += 1) {
        backgroundWindows.push(createBgWindow());
    }
};

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});

ipcMain.on('main:processEfxLines', (_, payload) => {
    tasks.push(['bg:processEfxLines', payload]);
    performTasks();
});

ipcMain.on('renderer:test', () => {
    win.webContents.send('main:test-response', 'hewwo');
});

ipcMain.on('bg:efxLinesResult', (_, arg) => {
    win.webContents.send('renderer:efxLines', arg);
});

ipcMain.on('bg:ready', (event) => {
    available.push(event.sender);
    performTasks();
});

ipcMain.on('main:log', (_, message) => {
    console.log(`log in main: ${message}`);
});

ipcMain.on('main:reloadBackground', () => {
    console.log('reloading background');
    reloadBackgroundWindows();
});

// receive full redux store to save
ipcMain.on('main:sendReduxStore', (_, reduxStore) => {
    console.log('receiving redux store');
    global.reduxStore = reduxStore;
    showSaveDialog();
});

// receive current gif blob
ipcMain.on('main:sendGifBlob', (_, gifBlob) => {
    console.log('receiving gif blob');
    global.gifBlob = gifBlob;
});

// receive current gif blob
ipcMain.on('main:saveGif', async () => {
    const { filePath, canceled } = await dialog.showSaveDialog(win, {
        title: 'save gif',
        buttonLabel: 'save',
        filters: [
            {
                name: 'gif',
                extensions: ['gif']
            }
        ]
    });

    if (canceled) {
        return;
    }

    const splitPath = filePath.split('/');
    const fileName = splitPath.pop().replace('.gif', '');
    const joinedPath = splitPath.join('/');

    // create an image with the a given name ie 'image'
    base64ImageToFile(global.gifBlob, joinedPath, fileName, (err) => {
        if (err) {
            return console.error(err);
        }

        return joinedPath;
    });
});

// create settings directories if they don't exist
const filesDir = fs.dir('userfiles');
filesDir.dir('presets');
filesDir.dir('drawings');
