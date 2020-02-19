var express = require("express");
var socket = require("socket.io");

var app = express();

var server = app.listen(5500, function() {
  console.log("listening on port 5500");
});

app.use(express.static("public"));

var io = socket(server);

var activeClients = 0;

io.on("connection", function(socket) {
  activeClients++;
  console.log(socket.id, "connected, active conncections:", activeClients);
  io.sockets.emit("clientCount", activeClients);
  socket.on("chat", function(data) {
    io.sockets.emit("chat", data);
  });

  socket.on("typing", function(data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function() {
    activeClients--;
    console.log(socket.id, "disconnected, active conncections:", activeClients);
    io.sockets.emit("clientCount", activeClients);
  });
});
