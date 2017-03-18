'use strict';
const services = require('@jupyterlab/services');
const ws = require('ws');
const xhr = require('xmlhttprequest');

const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const HTTP_PORT = 3000; // port number for local express app

global.XMLHttpRequest = xhr.XMLHttpRequest;
global.WebSocket = ws;

// server for our express app and websocket
server.listen(HTTP_PORT, () => {
    console.log('express listening on localhost:' + HTTP_PORT)
});

app.use(express.static('browser'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/browser/index.html');
})
