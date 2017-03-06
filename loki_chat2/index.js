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

        let options = { baseURL: BASE_URL, name:kernelModels[0].name }

        services.Kernel.connectTo(kernelModels[0].id,options).then((kernel)=>{
            console.log('user connected: '+socket.id)

            // unique handlers for each method type; return custom response with variable name as a key
            // drill in from broswer: responses.data[0].x.data["text/plain"] gives the actual response
            socket.on('message-1', (m) => {     //this calls echo_method_1 and sends back a unique variable
                let msg = JSON.parse(m);
                let future = kernel.requestExecute({ code:'',
                    user_expressions:{[`${msg.var_name}`]:`echo_method_1('${msg.msg}')`}   // array around template lets expressions be keys
                });
                future.onReply = function(reply){
                    io.to(socket.id).emit('message-reply', reply.content)   // all replies get sent back through a single channel
                }
            });

            socket.on('message-2', (m) => {     //this calls echo_method_2
                let msg = JSON.parse(m);
                let future = kernel.requestExecute({ code:'',
                    user_expressions:{[`${msg.var_name}`]:`echo_method_2('${msg.msg}')`}   // array around template lets expressions be keys
                });
                future.onReply = function(reply){
                    io.to(socket.id).emit('message-reply', reply.content)
                }
            });

            socket.on('message-3', (m) => {     //this calls echo_method_3
                let msg = JSON.parse(m);
                let future = kernel.requestExecute({ code:'',
                    user_expressions:{[`${msg.var_name}`]:`echo_method_3('${msg.msg}')`}   // array around template lets expressions be keys
                });
                future.onReply = function(reply){
                    io.to(socket.id).emit('message-reply', reply.content)
                }
            });

            socket.on('disconnect', ()=>{
                console.log('user disconnected: '+ socket.id)
            })

        });
        //need to close connection to kernel via services.Kernel somehow

    });
});
