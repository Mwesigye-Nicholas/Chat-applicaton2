const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector("chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");


//* get username and room from URL.
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
console.log(username, room);
const socket = io();

//* join chatroom.
socket.emit("joinRoom", { username, room });

//* Get room and users.
socket.on("roomUsers", ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on("message", (message) => {
    console.log(message);
    outputMessage(message);
    //* Scroll down.
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  //* getting message text.
  const msg = event.target.elements.msg.value;

  //*emitting the message to the server.
    socket.emit("chatMessage", msg);
    //* clear input 
    event.target.elements.msg.value = "";
    event.target.elements.msg.focus();
});

//* output message to the DOM.
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = ` <p class="meta">${message.username}<span>${message.time}</span></p>
            <p class="text">
             ${message.text}
            </p>`;
    console.log(message.text);
    document.querySelector('.chat-messages').appendChild(div);

}
//*add room name to DOM.
const outputRoomName = (room) => {
    roomName.innerText = room;

}
//*add users to the DOM.
const outputUsers = (users) => {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
