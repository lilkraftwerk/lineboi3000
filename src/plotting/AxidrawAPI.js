const API_URL = 'http://localhost:4242/v1';

const headers = {
    Accept: '*/*',
    'Cache-Control': 'no-cache',
    'Accept-Encoding': 'gzip, deflate',
    Referer: 'http://localhost:4242/v1/pen',
    Connection: 'keep-alive',
    'cache-control': 'no-cache'
};

const PLOTTER_CONNECTION_STATES = {
    0: 'connected',
    1: 'simulated',
    2: 'disconnected'
};

class AxidrawAPI {
    constructor() {
        this.penUpHeight = 0.5;
        this.penDownHeight = 0.7;
        this.resultCallback = () => {};
    }

    async getStatus() {
        try {
            const result = await fetch(`${API_URL}/pen/`, {
                method: 'GET',
                headers
            });
            const json = await result.json();
            return {
                ...json,
                connectionStatus: PLOTTER_CONNECTION_STATES[json.simulation]
            };
        } catch {
            return {
                connectionStatus: PLOTTER_CONNECTION_STATES[2]
            };
        }
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
            const result = await this.setPenState(`x=${x}&y=${y}`);

            this.resultCallback(result);

            if (i === 0) {
                await this.setPenState(`state=${penDownHeight}`);
            }
        }
        await this.setPenState(`state=${penUpHeight}`);
        return Promise.resolve();
    }

    timeout(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async setPenState(state) {
        const result = await fetch(`${API_URL}/pen`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: state
        });
        const json = result.json();
        return Promise.resolve(json);
    }

    async resetMotor() {
        await fetch(`${API_URL}/motors`, { method: 'DELETE' });
    }

    async returnToStart() {
        await fetch(`${API_URL}/pen`, { method: 'DELETE' });
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

export default async () => {
    const axidraw = new AxidrawAPI();
    return axidraw;
};
