const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path')

const app = express();
const server = http.createServer(app);
const sockets = new Server(server);

const addresses = {}
let txt = {}

app.use( express.static(path.join(__dirname,'public')) );

sockets.on('connection', (socket)=>{
    const userId = socket.id; 
    const userIP = socket.handshake.address;
    
    if(txt[userIP]){
        socket.emit('transferData', txt[userIP]);
    }

    addresses[userIP] ? addresses[userIP].push(userId) : addresses[userIP] = [userId];

    console.log('User: ' + userId + ' Entrou com o ip: ' + userIP);

    socket.on('transferData', (data)=>{
        txt[userIP] = data;

        addresses[userIP].map(id=>{
            sockets.to(id).emit('transferData', data);
        })
    })

})

server.listen(3000);