import path from 'node:path';
import electronPath from 'electron'; // Require Electron from the binaries included in node_modules.
import { toMatchImageSnapshot } from 'jest-image-snapshot';

import { _electron as electron } from 'playwright';

expect.extend({ toMatchImageSnapshot });

const imageSnapshotOptions = {
    failureThreshold: 0.02,
    failureThresholdType: 'percent',
    customSnapshotsDir: 'tests/screenshots',
    customDiffDir: 'tmp/diffs'
};
let app;
describe('App Tests', () => {
    let mainPage;

    beforeAll(async () => {
        jest.setTimeout(30000);
        app = await electron.launch({
            path: electronPath,
            args: [path.join(__dirname, '..', '..', '..')]
        });
        // app.on('window', async (page) => {
        //     const filename = page.url()?.split('/').pop();
        //     console.log(`Window opened: ${filename}`)

        //     // capture errors
        //     page.on('pageerror', (error) => {
        //       console.error(error);
        //     })
        //     // capture console messages
        //     page.on('console', (msg) => {
        //       console.log(msg.text());
        //     })
        //   })
    });

    afterEach(async () => {
        await app.close();
    });

    it('Opens the main window and clicks around', async () => {
        while (true) {
            // find index.html amidst the background windows
            page = await app.waitForEvent('window');
            title = await page.url()?.split('/').pop();
            if (title === 'index.html') {
                break;
            }
        }

        await page.waitForSelector('#drawingContent');
        const drawPhoto = await page.screenshot();
        expect(drawPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        // await page.click('#modeButton-efx');
        // await page.waitForSelector('#efxContent', { visible: true });
        // const efxPhoto = await page.screenshot();
        // expect(efxPhoto).toMatchImageSnapshot({
        //     ...imageSnapshotOptions
        // });

        await page.click('#modeButton-plot');
        await page.waitForSelector('#plotContent', { visible: true });
        const plotPhoto = await page.screenshot();
        expect(plotPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await page.click('#modeButton-gifmaker', { visible: true });
        await page.waitForSelector('#gifmakerContent');
        const gifPhoto = await page.screenshot();
        expect(gifPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });

        await page.click('#modeButton-options', { visible: true });
        await page.waitForSelector('#optionsContent');
        const optionsPhoto = await page.screenshot();
        expect(optionsPhoto).toMatchImageSnapshot({
            ...imageSnapshotOptions
        });
    }, 15000);
});
