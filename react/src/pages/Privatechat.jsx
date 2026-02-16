import { useEffect, useRef, useState } from "react";
import { ensureSocketConnection } from "../middleware/Socket";
import "../styles/BroadcastChat.css";

export default function PrivateChat({ receiverId, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [vanishMode, setVanishMode] = useState(false);

  const socket = ensureSocketConnection();
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket || !receiverId || !currentUserId) return;

    socket.emit("join_private_room", {
      userId: currentUserId,
      targetUserId: receiverId
    });

    const handleHistory = (data) => {
      setMessages(data.messages || []);
      setVanishMode(data.vanishMode || false);
    };

    const handleReceive = (data) => {
      setMessages(prev => [...prev, data]);
    };

    const handleVanishUpdate = (mode) => {
      setVanishMode(mode);
      if (!mode) {
        setMessages(prev =>
          prev.filter(msg => msg.vanish_mode === false)
        );
      }
    };

    socket.on("private_history", handleHistory);
    socket.on("receive_private_message", handleReceive);
    socket.on("vanish_mode_updated", handleVanishUpdate);

    return () => {
      socket.off("private_history", handleHistory);
      socket.off("receive_private_message", handleReceive);
      socket.off("vanish_mode_updated", handleVanishUpdate);
    };

  }, [receiverId]);
  const sendMessage = () => {
    if (!text || !socket) return;

    socket.emit("send_private_message", {
      senderId: currentUserId,
      receiverId: receiverId,
      message: text
    });

    setText("");
  };
  const toggleVanish = () => {
    socket.emit("toggle_vanish_mode", {
      userId: currentUserId,
      targetUserId: receiverId,
      vanishMode: !vanishMode
    });
  };

  return (
    <div className="chat-box">

      <div className="top-interface">
        <h5>Private Chat</h5>
        <small>({receiverId})</small>

        <label style={{ color: "black" }}>
          <input type="checkbox" checked={vanishMode} onChange={toggleVanish}/>
          Vanish Mode
        </label>
      </div>

      <div className="messages" ref={messagesRef}>
        <ul id="messages">
          {messages.map((msg, index) => (
            <li key={index} className={ Number(msg.sender_id) === Number(currentUserId)? "right" : "left" } style={{ display: "flex" }}>
              <small style={{ color: "white" }}> {msg.sender_id} </small>
              <div className="bubble">
                {msg.message} {msg.vanish_mode && (<span style={{ color: "red", marginLeft: "5px" }}>(V)</span>)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="input-box">
        <input placeholder="Type message..." value={text}onChange={(e) => setText(e.target.value)}/>
        <button className="send-btn" onClick={sendMessage}>Send </button>
      </div>

    </div>
  );
}
