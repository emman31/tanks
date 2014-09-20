var http = require('http').createServer(onRequest),
  io = require('socket.io').listen(http, {log: false}),
  url = require('url'),
  fs = require('fs');
  tanks = require('./tanks');

http.listen(8888);

function onRequest(request, response) {
  var path = url.parse(request.url).pathname;

  if (path === '/') {
    path += 'index.html';
  }

  // All client requests for a file are redirected towars the 'client' folder.
  path = "/client" + path;

  var extension = path.split('/').pop().split('.').pop();
  var header;
  switch (extension) {
    case 'html':
      // Nothing needed fot html files.
      break;
    case 'css':
      header = {"Content-Type": "text/css"};
      break;
    case 'js':
      header = {"Content-Type": "application/javascript"};
      break;
    default:
  }
  fs.readFile(__dirname + '/..' + path,
    function(err, data) {
      if (err) {
        response.writeHead(500, header);
        return response.end("Error loading file '" + path + "'");
      }

      response.writeHead(200, header);
      response.write(data);
      response.end();
    }
  );
}

io.sockets.on('connection', function(socket) {
  var id = socket.id;
  console.log("Client connected: " + id);
  
  socket.on('execute', function(command, params) {
    console.log("Executing command '" + command + "' for client '" + id + "'.");
    var functionToExecute = tanks[command];

    // Make sure the command is an existing function.
    if (typeof functionToExecute !== 'function') {
      console.log(command + " is not a valid command.");
      return;
    }

    // Make sure params is an array of parameters.
    if (typeof params === 'undefined') {
      params = new Array();
    }
    else if (!(params instanceof Array)) {
      socket.emit('response', ["The 2nd parameter passed to Execute should be an array of parameters."]);
      console.log("The 2nd parameter passed to Execute should be an array of parameters.");
      return;
    }

    // Execute the function and make sure nothing crashes the server.
    var returnValue;
    try {
      returnValue = functionToExecute.apply(tanks, params);
      socket.emit('response', returnValue);
    }
    catch (e) {
      socket.emit('response', ["A server error occured. What are you trying to do?!?"]);
      console.log(e.stack);
    }
  });
});

console.log("Server has started.");
