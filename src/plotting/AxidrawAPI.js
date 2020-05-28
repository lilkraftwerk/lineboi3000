const API_URL = 'http://localhost:4242/v1';

const headers = {
    Accept: '*/*',
    'Cache-Control': 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    Referer: 'http://localhost:4242/v1/pen',
    Connection: 'keep-alive',
    'cache-control': 'no-cache'
};

class AxidrawAPI {
    constructor() {
        this.penUpHeight = 0.5;
        this.penDownHeight = 0.7;
    }

    async getStatus() {
        const result = await fetch(`${API_URL}/pen/`, {
            method: 'GET',
            headers
        });
        const json = await result.json();
        return json;
    }

    async getBuffer() {
        const result = await fetch(`${API_URL}/buffer/`, {
            method: 'GET',
            headers
        });
        const json = await result.json();
        return json;
    }

    async drawPath(path) {
        const { penUpHeight = 0, penDownHeight = 1 } = this;
        await this.setPenState(`state=${penUpHeight}`);

        for (let i = 0; i < path.length; i += 1) {
            const [x, y] = path[i];
            await this.setPenState(`x=${x}&y=${y}`);

            if (i === 0) await this.setPenState(`state=${penDownHeight}`);
        }
    }

    async setPenState(state) {
        await fetch(`${API_URL}/pen`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: state
        });
    }

    async resetMotor() {
        await fetch(`${API_URL}/motors`, { method: 'DELETE' });
    }

    async parkPen() {
        await this.setPenState('state=0');
        await this.setPenState(`x=0&y=0`);
    }

    setPenHeights({ penDownHeight, penUpHeight }) {
        this.penDownHeight = penDownHeight;
        this.penUpHeight = penUpHeight;
    }

    async penDown() {
        const { penDownHeight } = this;
        await this.setPenState(`state=${penDownHeight}`);
    }

    async penUp() {
        const { penUpHeight } = this;
        await this.setPenState(`state=${penUpHeight}`);
    }
}

export default async function () {
    const axidraw = new AxidrawAPI();
    return axidraw;
}
