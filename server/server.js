var http = require('http').createServer(onRequest),
  io = require('socket.io').listen(http, {log: false}),
  url = require('url'),
  fs = require('fs');
//  jewel = require('./jewel');

http.listen(8888);

function onRequest(request, response) {
  var path = url.parse(request.url).pathname;

  if (path === '/') {
    path += 'index.html';
  }

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
  socket.on('disconnect', function() {
    jewel.Execute("Disconnect", [socket.id]);
  });
/*
  socket.on('restart', function(debug) {
    var grid = jewel.Execute("StartGame", [socket.id, debug]);
    socket.emit('game_started', grid);
  });
  socket.on('find_all_matches', function() {
    jewel.Execute("FindAllMatches", [socket.id]);
  });
  socket.on('break_all_matches', function() {
    var grid = jewel.Execute("BreakAllMatches", [socket.id]);
    socket.emit('redraw', grid);
  });
  socket.on('get_grid_json', function() {
    var json = jewel.Execute("GetGridJSON", [socket.id]);
    socket.emit('update_json', json);
  });
  socket.on('update_grid_json', function(json) {
    var grid = jewel.Execute("UpdateGridJSON", [socket.id, json]);
    socket.emit('redraw', grid);
  });
  socket.on('go_down', function() {
    var grid = jewel.Execute("GoDown", [socket.id]);
    socket.emit('redraw', grid);
  });

  socket.on('swap', function(cell1, cell2) {
    jewel.Execute("Swap", [socket.id, cell1, cell2]);
    var grid = jewel.Execute("GetGrid", [socket.id]);
    socket.emit('redraw', grid);
  });

*/
});


console.log("Server has started.");
