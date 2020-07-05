import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import path from 'path';
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const { Application } = require('spectron');

expect.extend({ toMatchImageSnapshot });

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..', '..', '..')]
});

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};

describe('App Tests', () => {
    beforeEach(() => {
        jest.setTimeout(30000);
        return app.start();
    });

    afterEach(() => {
        return app.stop();
    });

    it('Opens the main window and clicks around', async () => {
        await app.client.isExisting('#drawingContent');
        const drawPhoto = await app.browserWindow.capturePage();
        expect(drawPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click(`#modeButton-efx`);
        await app.client.isExisting('#efxContent');
        const efxPhoto = await app.browserWindow.capturePage();
        expect(efxPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click(`#modeButton-plot`);
        await app.client.isExisting('#plotContent');
        const plotPhoto = await app.browserWindow.capturePage();
        expect(plotPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click(`#modeButton-gifmaker`);
        await app.client.isExisting('#gifmakerContent');
        const gifPhoto = await app.browserWindow.capturePage();
        expect(gifPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });
    });
});
