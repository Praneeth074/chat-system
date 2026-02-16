import { useEffect, useRef, useState } from "react";
import { ensureSocketConnection } from "../middleware/Socket";
import "../styles/BroadcastChat.css";

export default function BroadcastChat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState([]);
  const socket = ensureSocketConnection();
  const messagesRef = useRef(null);
  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  // Auto scroll
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop =
        messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!socket) return;
    const handleReceive = (data) => {
      setMessages(prev => [...prev, data]);
    };
    const handleHistory = (data) => {
      console.log(data)
      setMessages(data.data || []);
    };
    socket.on("chat_history", handleHistory);
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("chat_history", handleHistory);
      socket.off("receive_message", handleReceive);
    };

  }, []);
  const sendMessage = () => {
    if (!text || !socket || !currentUser) return;

    socket.emit("send_message", {
      userId: currentUser.ID,
      text: text
    });

    setText("");
  };
  const requestHistory = () => {
    socket.emit("request_history");
  };

  return (
    <div className="chat-box">

      <div className="top-interface">
        <h5>Broadcast Chat</h5>
        <button onClick={requestHistory}> Retreive History</button>
      </div>

      <div className="messages" ref={messagesRef}>
        <ul id="messages">
          {messages.map((msg, index) => (
            <li
              key={index}
              className={
                Number(msg.userid) === Number(currentUser?.ID)
                  ? "right"
                  : "left"
              }
              style={{ display: "flex" }}
            >
              <small style={{ color: "white" }}>
                {msg.userid}
              </small>

              <div className="bubble">
                {msg.message}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="input-box">
        <input
          id="msg"
          placeholder="Type message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="send-btn"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>

    </div>
  );
}
