// modified code from the socket.io chat tutorial...
  var socket = io.connect("http://localhost:3000");

  $('#form1').submit(function(event){
      event.preventDefault()
      socket.emit('message-1', $('#m1').val());  // emit the value
      $('#m1').val('');
  });

  $('#form2').submit(function(event){
      event.preventDefault()
      socket.emit('message-2', $('#m2').val());  // emit the value
      $('#m2').val('');
  });

  // two seperate handlers for each
  socket.on('message-1', function(msg){               // handle the reply message
      $('#messages').append($('<li>').text(msg));
  })

  socket.on('message-2', function(msg){               // handle the reply message
      $('#messages').append($('<li>').text(msg));
  })
