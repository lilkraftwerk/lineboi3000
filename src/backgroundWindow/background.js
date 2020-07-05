import { ipcRenderer } from 'electron';
import EfxProcessingUnit from '../efxProcessing/EfxProcessingUnit';

function ready() {
    ipcRenderer.send('bg:ready');
}

ipcRenderer.on('message', () => {
    ready();
});

ipcRenderer.on('bg:processEfxLines', (event, payload) => {
    ipcRenderer.send('main:log', 'starting to process lines...');
    ipcRenderer.send('main:log', `payload layerID: ${payload.layerID}`);
    const workerResult = EfxProcessingUnit(payload);
    ipcRenderer.send('bg:efxLinesResult', workerResult);
    ready();
});

ready();
