from socketIO_client import SocketIO
import time

name = 'bob'

def send():
    with SocketIO('localhost', 3000) as socket:
        socket.emit('py-name-message', name)
send()
