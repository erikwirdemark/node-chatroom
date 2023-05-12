let chatrooms = new Map();

const express = require("express");

var app = express();
var port = 3000;


const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is listening on ${port}`);
});

const io = require("socket.io")(server);

//The following code includes all the actions that take place in the server when events are emitted from the client
io.on("connection", (socket) => {
  console.log("New connection...");


//When a new user is created, a new room is generated or they are placed in an existing room
  socket.on("createUser", ({username, chatroom}) => {
    if (chatrooms.has(chatroom)) {
      socket.emit("new user", (username))
      chatrooms.get(chatroom).forEach(user=>{
        user.socket.emit("new user", (username));
        socket.emit("new user", (user.username));
      })
      chatrooms.get(chatroom).add({ username, socket });
    } else {
      let newUsers = new Set();
      newUsers.add({ username, socket});
      chatrooms.set(chatroom, newUsers);
      socket.emit("new user", (username));
    }
  });

  //When the user sends a chat the message is sent back to all sockets in the same room
  socket.on("chat", ({message, username, chatroom}) => {
    let room = chatrooms.get(chatroom);
    if(room==null){
        console.log("something went wrong");
    }else {
        room.forEach((user) => {
            user.socket.emit("incomingMessage",  ({message, username}) );
          });
    }
  });
});

app.use(express.static("../client"));
