import path from 'node:path';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import { toMatchImageSnapshot } from 'jest-image-snapshot';

const { Application } = require('spectron');

expect.extend({ toMatchImageSnapshot });

const app = new Application({
    path: electronPath,
    args: [path.join(__dirname, '..', '..', '..')],
    chromeDriverArgs: ['remote-debugging-port=9222']
});

const LOAD_DELAY = 1200;

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
        await app.client.waitForVisible('#drawingContent');
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
        const drawPhoto = await app.browserWindow.capturePage();
        expect(drawPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click('#modeButton-efx');
        await app.client.waitForVisible('#efxContent');
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
        const efxPhoto = await app.browserWindow.capturePage();
        expect(efxPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click('#modeButton-plot');
        await app.client.waitForVisible('#plotContent');
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
        const plotPhoto = await app.browserWindow.capturePage();
        expect(plotPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click('#modeButton-gifmaker');
        await app.client.waitForVisible('#gifmakerContent');
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
        const gifPhoto = await app.browserWindow.capturePage();
        expect(gifPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await app.client.click('#modeButton-options');
        await app.client.waitForVisible('#optionsContent');
        await new Promise((resolve) => setTimeout(resolve, LOAD_DELAY));
        const optionsPhoto = await app.browserWindow.capturePage();
        expect(optionsPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });
    });
});
