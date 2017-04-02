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

app.use(express.static(__dirname + '/browser'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/browser/index.html');
})


let main_room = io.of('/main');
let py_room = io.of('/py');


let connections = {};
let current_browser_id = null; // temp variable that stores a 



main_room.on('connection', (socket)=>{
    // jupyter lab services code in here
        // main_room socket relays handle all method calls on the associated instance

    console.log('browser_connected: '+ socket.id)
});


py_room.on('connection', (socket)=>{


    socket.on('py-object-name', (py_obj_name)=>{

        connections[current_browser_id] = py_obj_name // sets active connection
        console.log(connections)

        py_room.to(current_browser_id).emit('pyobj-ref-to-browser', {
            'browser_sock_id': current_browser_id,
            'py_obj_name': py_obj_name
        });

        socket.emit('pyconnect_response', JSON.stringify({
            'browser_sock_id': current_browser_id,
            'py_obj_name': py_obj_name
        }));
    });
    
});


