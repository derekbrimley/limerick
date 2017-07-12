var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

players = [];

io.on('connection', function(socket){
  const player = {
    id: socket.id,
    username: 'player ' + (players.length + 1),
  };
  players.push(player);
  console.log('Players:');
  console.log(players);
  io.emit('chat message', 'New player ' + player.username + ' connected');
  socket.on('disconnect', function(){
    const player = players.find(player => player.id === socket.id);
    const newPlayers = players.filter(player => player.id !== socket.id);
    players = newPlayers;
    console.log('Disconnected: ' + player.id, socket.id, players);
    console.log('user ' + player.username + ' disconnected');
    io.emit('chat message', 'user ' + player.username + ' disconnected');
  });
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});