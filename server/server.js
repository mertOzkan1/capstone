const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
//const nidaqmx = require('nidaqmx'); // NI-DAQmx işlevlerine erişim sağlayan kütüphane

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// DAQ cihazından veri alma ve istemcilere iletim
io.on('connection', (socket) => {
    console.log('Yeni bir istemci bağlandı.');

    // DAQ'dan veri al
    const task = new nidaqmx.Task();
    task.createAIVoltageChan('Dev1/ai0:3'); // Örnek olarak AI0, AI1, AI2 ve AI3 portlarından veri alınacak

    setInterval(() => {
        const data = task.readAnalogScalarF64();
        socket.emit('data', data); // Veriyi istemcilere iletiyoruz
    }, 1000); // Örneğin her saniyede bir veri gönderiyoruz

    socket.on('disconnect', () => {
        console.log('Bir istemci ayrıldı.');
        task.stop(); // İstemci ayrıldığında DAQ veri okumayı durdur
    });
});

server.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});
