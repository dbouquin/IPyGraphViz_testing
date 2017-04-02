var generic_socket = io.connect('http://localhost:3000')
//var py_room = io('/py')  // connect a socket to python room 
var browser_room = io('/browser')
var main_room = io('/main') // connect a socket to the main room


//TODO loki init here


// this listener receives the python object reference
py_socket.on('pyobj-ref-to-browser', (obj_ref)=>{
    // TODO error handling here
    console.log('received name: ' + obj_ref)

    // TODO loki stores this reference at this point...

});

// TODO jquery/socket events and sigma code to 