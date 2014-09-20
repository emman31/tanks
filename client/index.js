$(window).load(function document_ready() {
  socket = io.connect('http://162.248.162.83:8888/');

  socket.emit('execute', 'NewGame', ['patate']);
  
  socket.on('response', function(args) {
    console.log(args);
  });
});