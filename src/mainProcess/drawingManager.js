const { ipcMain } = require('electron');
const fs = require('fs-jetpack');

ipcMain.on('drawing:listnames:request', async event => {
    const fileNames = fs.find('userfiles/drawings', {
        matching: ['*.drawing.json']
    });
    event.reply('d:list:reply', fileNames);
});

ipcMain.on('drawing:getall:request', async event => {
    const fileNames = fs.find('userfiles/drawings', {
        matching: ['*.drawing.json']
    });
    const allDrawingPromises = fileNames.map(path =>
        fs.readAsync(path, 'json')
    );
    const response = await Promise.all(allDrawingPromises);
    event.reply('drawing:getall:reply', response);
});

ipcMain.on('drawing:save', (event, arg) => {
    const { name } = arg;
    const path = `userfiles/drawings/${name}.drawing.json`;
    fs.write(path, arg);
});
