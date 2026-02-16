const { saveMessage, getAllMessages, createRoomIfNotExists, getRoomSettings, getPrivateMessages, savePrivateMessage,updateRoomVanishMode,deleteVanishMessages } = require("./socket-service")
const generateRoomId = (user1, user2) => {
    const u1 = Number(user1);
    const u2 = Number(user2);
    return u1 < u2 ? `room_${u1}_${u2}`: `room_${u2}_${u1}`;
};


module.exports = {
    sendMessage: async (io,socket,data)=>{
        try {
            if (!data || !data.text) {
                io.emit("error", "Message text is required");
                return;
            }
            const savedMessage = await saveMessage(data);
            io.emit("receive_message", savedMessage);
        } 
        catch (err) {
            io.emit("error",{
                message : err.message
            })
        }
    },
    chatHistory: async(io,socket) =>{
        try{
            const allMessages = await getAllMessages();
            socket.emit("chat_history", {
                data: allMessages
            })
        }
        catch(err){
            io.emit("error",{
                message : err.message
            })
        }
    },
    joinPrivateRoom: async (io, socket, data) => {
        try {
            const { userId, targetUserId } = data;
            const roomId = generateRoomId(userId, targetUserId); // generate roomID
            await createRoomIfNotExists(roomId, userId, targetUserId);// check room existence
            socket.join(roomId);// join in room
            const history = await getPrivateMessages(roomId);// get previous messages
            const roomSettings = await getRoomSettings(roomId);// vanishmode ON or OFF
            socket.emit("private_history", {
                messages: history,
                vanishMode: roomSettings?.vanish_mode || false
            });

        } catch (err) {
            socket.emit("error", { message: err.message });
        }
    },

    sendPrivateMessage: async (io, socket, data) => {
        try {
            const { senderId, receiverId, message } = data;
            if (!message) {
                socket.emit("error", { message: "Message required" });
                return;
            }
            const roomId = generateRoomId(senderId, receiverId);// generate roomID
            const roomSettings = await getRoomSettings(roomId);// vanishmode ON or OFF
            const vanishState = roomSettings?.vanish_mode || false; //prechecking of room status (Double check)
            const savedMessage = await savePrivateMessage({roomId, senderId, message, vanishMode: vanishState});
            io.to(roomId).emit("receive_private_message", savedMessage); //send msg to that room
        } catch (err) {
            socket.emit("error", { message: err.message });
        }
    },

    toggleVanishMode: async (io, socket, data) => {
        try {
            const { userId, targetUserId, vanishMode } = data;
            const roomId = generateRoomId(userId, targetUserId); //generate room_id
            await updateRoomVanishMode(roomId, userId, targetUserId, vanishMode); // True or false updation
            if (!vanishMode) { // if false call delete service
                await deleteVanishMessages(roomId);
            }
            io.to(roomId).emit("vanish_mode_updated", vanishMode); //send msg to that room
        } catch (err) {
            socket.emit("error", { message: err.message });
        }
    },

}