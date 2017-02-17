'use strict';
const services = require('@jupyterlab/services');
const ws = require('ws');
const xhr = require('xmlhttprequest-ssl');

const app = require('express')();
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

            socket.on('message', (msg) => {
                console.log(typeof(msg))

                let future = kernel.requestExecute({
                    code:'',
                    user_expressions:{"hw":`echo('${msg}')`}
                });
                future.onReply = function(reply){
                    console.log('response: ' + JSON.stringify(reply.content));
                    // emit return JSON to browser
                    io.emit('message', JSON.stringify(reply.content.user_expressions))

                }
            });
        });

        //need to close connection to kernel via services.Kernel somehow

    });
});
