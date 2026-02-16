const { sendMessage, chatHistory, joinPrivateRoom,
    sendPrivateMessage,
    toggleVanishMode } = require('./socket-controller')


module.exports = (io, socket) => { 
    socket.on("send_message",(data) => { // register controller functions to events
        sendMessage(io,socket,data)
    })
    socket.on("request_history", ()=>{
        chatHistory(io,socket)
    })
    socket.on("join_private_room", (data) => {
        joinPrivateRoom(io, socket, data)
    });
    socket.on("send_private_message", (data) => {
        sendPrivateMessage(io, socket, data)
    });
    socket.on("toggle_vanish_mode", (data) => {
        toggleVanishMode(io, socket, data)
    });
}