const socketRouter = require("./socket-router");
module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("user connected: ",socket.id)
        socketRouter(io,socket)
        socket.on("disconnect", ()=>{
            console.log("user disconnected: ",socket.id)
        })
    })
}
