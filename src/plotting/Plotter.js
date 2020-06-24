import axidrawAPI from './AxidrawAPI';

export default class Plotter {
    constructor(lines = []) {
        this.lines = lines;
        this.shouldAbortPrinting = false;
    }

    async createAxidraw() {
        this.axidraw = await axidrawAPI();
    }

    async getPlotterStatus() {
        const result = await this.axidraw.getStatus();
        return result;
    }

    async getPlotterBuffer() {
        const result = await this.axidraw.getBuffer();
        return result;
    }

    setLines(lines) {
        this.lines = lines;
    }

    parkPen() {
        this.axidraw.parkPen();
    }

    returnToStart() {
        this.axidraw.returnToStart();
    }

    penUp() {
        this.axidraw.penUp();
    }

    penDown() {
        this.axidraw.penDown();
    }

    setPenHeights({ penDownHeight, penUpHeight }) {
        this.axidraw.setPenHeights({ penDownHeight, penUpHeight });
    }

    abort() {
        this.stopPlotting = true;
    }

    continue() {
        this.stopPlotting = false;
    }

    async print(lineCallback = () => {}) {
        if (!this.axidraw) {
            this.axidraw = await this.createAxidraw();
        }

        this.continue();
        for (let i = 0; i < this.lines.length; i += 1) {
            if (this.stopPlotting) {
                i = this.lines.length + 1;
                return;
            }
            const line = this.lines[i];
            lineCallback(line.id);
            await this.axidraw.drawPath(line.percentageCoordinates);
        }

        await this.axidraw.parkPen();
    }
}
