'use strict';
const services = require('@jupyterlab/services');
const ws = require('ws');
const xhr = require('xmlhttprequest-ssl');

const express = require('express')
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const BASE_URL = 'http://localhost:8888';
const HTTP_PORT = 3000;


//Override the global request and socket functions this is for @jupyter services.
global.XMLHttpRequest = xhr.XMLHttpRequest;
global.WebSocket = ws;

// server for our express app and websocket
server.listen(HTTP_PORT, () => {
    console.log('express listening on localhost:' + HTTP_PORT)
});

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection',(socket) => {
    console.log('connection established')

    //listen for requests to notebook server and send response back to browser
    //connectKernel(socket)
    services.Kernel.listRunning({baseURL:BASE_URL}).then((kernelModels)=>{
        //console.log(kernelModels[0])
        let options = { baseURL: BASE_URL, name:kernelModels[0].name }

        services.Kernel.connectTo(kernelModels[0].id,options).then((kernel)=>{
            console.log('user connected: '+socket.id)

            socket.on('message-1', (msg) => {
                let future = kernel.requestExecute({ code:'', user_expressions:{"hw1":`echo('${msg}')`}});
                future.onReply = function(reply){
                    console.log(JSON.stringify(reply.content));
                    io.to(socket.id).emit('message-1', reply.content)
                }
            });

            socket.on('message-2', (msg) => {
                let future = kernel.requestExecute({code:'',user_expressions:{"hw2":`echo('${msg}')`}});
                future.onReply = function(reply){
                    console.log(JSON.stringify(reply.content));
                    io.to(socket.id).emit('message-2', reply.content)
                }
            });

            socket.on('disconnect', ()=>{
                console.log('user disconnected: '+ socket.id)
            })

        });
        //need to close connection to kernel via services.Kernel somehow

    });
});
