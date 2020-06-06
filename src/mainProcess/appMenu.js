const { showOpenDialog } = require('./SaveAndLoad');
const { undo } = require('./Undo');

const isMac = process.platform === 'darwin';
const appMenu = (window) => {
    return [
        ...(isMac
            ? [
                  {
                      label: 'lineboi',
                      submenu: [
                          { role: 'about' },
                          { type: 'separator' },
                          { role: 'services' },
                          { type: 'separator' },
                          { role: 'hide' },
                          { role: 'hideothers' },
                          { role: 'unhide' },
                          { type: 'separator' },
                          { role: 'quit' }
                      ]
                  }
              ]
            : []),
        {
            label: 'File',
            submenu: [
                { role: 'close' },
                {
                    label: 'New Project',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        window.webContents.send('menu:newProject');
                    }
                },
                { type: 'separator' },
                {
                    label: 'Open Project',
                    accelerator: 'CmdOrCtrl+O',
                    click: () => {
                        showOpenDialog(window);
                    }
                },
                { type: 'separator' },
                {
                    label: 'Save Current Project',
                    accelerator: 'CmdOrCtrl+S',
                    click: () => {
                        window.webContents.send('menu:startSaveProcess');
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => {
                        undo(window);
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload Background Windows',
                    accelerator: 'CmdOrCtrl+B',
                    click: () => {
                        window.webContents.send('app:reloadBackground');
                    }
                },
                { role: 'reload' },
                { role: 'forcereload' },
                { role: 'toggledevtools' },
                { type: 'separator' },
                { role: 'resetzoom' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'zoom' },
                ...(isMac
                    ? [
                          { type: 'separator' },
                          { role: 'front' },
                          { type: 'separator' },
                          { role: 'window' }
                      ]
                    : [{ role: 'close' }])
            ]
        }
    ];
};

module.exports = appMenu;
