// modified code from the socket.io chat tutorial...
var socket = io.connect("http://localhost:3000");

var idbAdapter = new LokiIndexedAdapter();
var db = new loki("test.db", { adapter: idbAdapter });

// Add a collection to the database
var responses = db.addCollection('responses');

// this approach assumes a response variable is bound to each form... form1 -> hw1 form2 ->hw2
$('#form1').submit(function(event){
    event.preventDefault()
    $msg = $('#m1')

    query_loki('hw1').then(function(db_query){       //query object from loki... if not in db emit request to kernel
        if (db_query.length != 0)
            $('#messages').append($('<li>').text("hw1 already in Loki: " + JSON.stringify(db_query[0])));
        else
            socket.emit('message-1', $msg.val());  // emit the value
        $msg.val('');
    });
});

$('#form2').submit(function(event){
    event.preventDefault()
    $msg = $('#m2')

    query_loki('hw2').then(function(db_query){
        if (db_query.length != 0)
            $('#messages').append($('<li>').text("hw2 already in Loki: "JSON.stringify(db_query[0])));
        else
            socket.emit('message-2', $msg.val());  // emit the value

        $msg.val(''); //clear field
    });
});

// two seperate handlers for each
socket.on('message-1', function(msg){               // handle the reply message
    $('#messages').append($('<li>').text("Jupyter says: " + JSON.stringify(msg)));  // string gets appended immediately
    //push the response into the database
    push_to_loki(msg);
})

socket.on('message-2', function(msg){               // handle the reply message
    $('#messages').append($('<li>').text( "Jupyter says: " + JSON.stringify(msg)));
    push_to_loki(msg)
})

// loki helper functions that parses and pushes
function push_to_loki(msg){
    responses.insert(msg.user_expressions);
    db.saveDatabase();
}

function query_loki(res_var){
    q_obj = {};
    q_obj[res_var] = {'$contains' : 'data'};  // checks to see if key 'hw-' in collection
    return Promise.resolve(responses.find(q_obj));
}
