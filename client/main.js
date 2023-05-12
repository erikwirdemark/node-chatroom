const socket = io();
const user = {
    username: "",
    chatroom: ""
  };

//This adds an eventlistener to the button in the login page, emitting an event that generates rooms, and renders the chat elements.
var userNameButton = document.getElementById("userNameButton");
userNameButton.addEventListener("click", (e) => {
    var userNameInfo = document.getElementById("userName").value;
    var chatroomInfo = document.getElementById("chatroom").value;
    user.username= userNameInfo;
    user.chatroom= chatroomInfo;
    console.log("chatroom client", user.chatroom)
    console.log("username client", user.username)
    socket.emit("createUser",  (user));
    const popup = document.getElementById("popup");
    popup.remove();
    displayChat(user);
    addListeners(user);
  });

//The eventlistener tells the client socket what to do when a message is sent from the server
socket.on("incomingMessage", ({ message, username }) => {
  console.log(`${username} sent the message: ${message}`);
  if (username == user.username) {
    sendMessage(message);
  } else {
    receiveMessage(message, username);
  }
});

//The eventlistener registers a new user and displays them on the active users element of the page
socket.on("new user", (username) => {
    console.log(username)
    addUser(username);
});

socket.on("disconnect", (data) => {
  
});

//Displays the message sent by the client on the messagefeed
function sendMessage(message) {
  var feed = document.getElementById("messageFeed");
  const newMessage = document.createElement("div");
  newMessage.className = "outgoingMessage";
  newMessage.innerHTML = `<p>${message}</p>`;
  feed.appendChild(newMessage);
}

//Displays the message received by another user in the room on the messagefeed
function receiveMessage(message, sender) {
  var feed = document.getElementById("messageFeed");
  const newMessage = document.createElement("div");
  newMessage.className = "incomingMessage";
  newMessage.innerHTML = `<p>${message}</p>`;
  const senderInfo = document.createElement("div");
  senderInfo.className = "senderDisplay";
  senderInfo.innerHTML = `<p>${sender}</p>`;
  feed.appendChild(senderInfo);
  feed.appendChild(newMessage);
}

//Adds user to the active user element on the page
function addUser(username) {
  var userList = document.getElementById("userList");
  const newUser = document.createElement("div");
  newUser.innerHTML = `<p>${username}</p>`;
  userList.appendChild(newUser);
}

//Renders the chat and generates all the elements surrounding the chat.
function displayChat({username, chatroom}) {
  const chat = document.createElement("div");
  chat.innerHTML = `<header>SuperCoolChatroom</header>
    <div class="userDisplay" id="userDisplay" >
        <subheader>You are in room: </subheader>
        <subheader style="100px" class="inputs">${chatroom}</subheader>
        <subheader style="margin-top: 10px" >Active users:</subheader>

        <div id="userList">
        </div>
    </div>
    <div class="chatbox">
        <div class="messageFeed" id="messageFeed">

        </div>
        <div class="textBar">
            <input style ="width:600px" type="text" id="message" class="inputs" placeholder="  Write your message here...">
            <button id="send" class="buttons">Send</button>
        </div>
    </div>
    `;
  document.body.appendChild(chat);
}

//Adds the eventlisteners of the dynamically created HTML elements
function addListeners({username, chatroom}) {
  var btn = document.getElementById("send");
  btn.addEventListener("click", (e) => {
    var message = document.getElementById("message").value;
    if(message.trim()!=""){
      socket.emit("chat",  ({message, username, chatroom}));
      document.getElementById("message").value = "";
    }
  })
}