const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const fs = require('fs-jetpack');

const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS
} = require('electron-devtools-installer');

const debugBackgroundWindow = false;
const cpus = debugBackgroundWindow ? 1 : require('os').cpus().length;

console.log(`num available cpus: ${cpus}`);

let win;
// stack of available background threads
const available = [];

// queue of tasks to be done
const tasks = [];

require('./src/mainProcess/presetManager');
require('./src/mainProcess/drawingManager');
const menuTemplateGenerator = require('./src/mainProcess/appMenu');
const { showSaveDialog } = require('./src/mainProcess/SaveAndLoad');

function createWindow() {
    win = new BrowserWindow({
        width: 1500,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true
        },
        show: false
    });

    // run web server from here
    const mainUrl = `file://${__dirname}/dist/index.html`;
    win.loadURL(mainUrl);

    win.webContents.once('dom-ready', () => {
        win.webContents.openDevTools();
    });

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('did-finish-load', () => {
        win.show();
    });

    const menu = Menu.buildFromTemplate(menuTemplateGenerator(win));
    Menu.setApplicationMenu(menu);

    installExtension(REACT_DEVELOPER_TOOLS)
        .then(name => {
            console.log(`Added Extension:  ${name}`);
        })
        .catch(err => {
            console.log('An error occurred: ', err);
        });

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
        createBgWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

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

ipcMain.on('bg:ready', event => {
    available.push(event.sender);
    performTasks();
});

ipcMain.on('main:log', (_, message) => {
    console.log(`log in main: ${message}`);
});

// receive full redux store to save
ipcMain.on('main:sendReduxStore', (_, reduxStore) => {
    console.log('receiving redux store');
    global.reduxStore = reduxStore;
    showSaveDialog();
});

// create settings directories if they don't exist
const filesDir = fs.dir('userfiles');
filesDir.dir('presets');
filesDir.dir('drawings');
