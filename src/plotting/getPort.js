const { autoDetect } = require('@serialport/bindings-cpp');

const BOT_MANUFACTURER = 'SchmalzHaus';

async function findSerialPort() {
    try {
        const Binding = autoDetect();
        const ports = await Binding.list();
        const port = ports.find((p) => p.manufacturer === BOT_MANUFACTURER);

        if (port) {
            process.stdout.write(`${port.path}`);
        } else {
            process.stdout.write('{auto}');
        }
    } catch (err) {
        console.error('Error listing ports', err);
    }
}

findSerialPort();
