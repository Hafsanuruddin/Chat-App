const chatForm=document.getElementById('chat-form');
const chatMessages=document.querySelector('.chat-messages');
const OutputRoomName= document.getElementById('room-name');
const userList =document.getElementById('users');

// get username and room from url
 const{ username, room} =Qs.parse(location.search, {
    ignoreQueryPrefix : true
 });


const socket = io();

//join chat room
socket.emit('joinRoom', {username ,room});

//get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    OutputUsers(users);
});

//Message from server
 socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    
    //scroll down to new messages
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit 
chatForm.addEventListener('submit',(e) => {
    e.preventDefault();

    //get message text
const msg=e.target.elements.msg.value;

//emit messages to server
 socket.emit('chatMessage', msg);

 //clear input
e.target.elements.msg.value ='';
e.target.elements.msg.focus();
});

// output message to DOM
function outputMessage(message) {
     const div = document.createElement('div');
     div.classList.add('message');
     div.innerHTML= `<p class="meta">${message.username} <span> ${message.time}</span></p>
     <p class="text">
        ${message.text}
     </p>`;
     chatMessages.appendChild(div);
}


//ad  room name to dom
function outputRoomName(room) {
    OutputRoomName.innerHTML=room;

}

// add users to Dom

function OutputUsers(users) {
    // Use map to transform usernames into an array of list items
    const userItems = users.map(user => `<li> ${user.username}</li>`);

    // Join the list items together
    userList.innerHTML = userItems.join('');
}
