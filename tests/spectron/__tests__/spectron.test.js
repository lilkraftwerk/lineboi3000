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

    it('Opens the main window', async () => {
        await app.client.isExisting('#drawingContent');
        const photo = await app.browserWindow.capturePage();
        expect(photo).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });
    });
});
