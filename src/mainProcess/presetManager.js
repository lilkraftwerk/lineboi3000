const { ipcMain } = require('electron');
const fs = require('fs-jetpack');

ipcMain.on('preset:list:request', async event => {
    console.log('preset list request');
    const presets = fs.find('userfiles/presets', {
        matching: ['*.preset.json']
    });
    console.log('presets', presets);
    const allPresetPromises = presets.map(path => fs.readAsync(path, 'json'));
    const response = await Promise.all(allPresetPromises);
    console.log('response', response);
    event.reply('preset:list:reply', response);
});

ipcMain.on('preset:save', (event, arg) => {
    const { name } = arg;
    const path = `userfiles/presets/${name}.preset.json`;
    fs.write(path, arg);
});
