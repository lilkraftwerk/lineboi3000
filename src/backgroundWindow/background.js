import { ipcRenderer } from 'electron';
import EfxProcessingUnit from '../efxProcessing/EfxProcessingUnit';

// // Send logs as messages to the main thread to show on the console
// function log(value) {
//     ipcRenderer.send('to-main', `${process.pid}: ${value}`);
// }

// let the main thread know this thread is ready to process something
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
