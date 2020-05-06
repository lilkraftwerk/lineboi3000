const SerialPort = require('serialport');

const BOT_MANUFACTURER = 'SchmalzHaus';

SerialPort.list().then(
    ports => {
        const port = ports.find(p => p.manufacturer === BOT_MANUFACTURER);

        if (port) {
            process.stdout.write(port.comName);
            return;
        }

        process.stdout.write('{auto}');
    },
    err => {
        console.error('Error listing ports', err);
    }
);
