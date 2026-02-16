import { useState, useEffect } from "react";
import BroadcastChat from "./BroadcastChat";
import PrivateChat from "./Privatechat";
import { disconnectSocket } from "../middleware/Socket";
import axios from "axios";

export default function Dashboard() {

  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("broadcast");
  const [selectedUser, setSelectedUser] = useState(null);

  const userString = localStorage.getItem("user");
  const currentUser = userString ? JSON.parse(userString) : null;

  const fetchUsers = async () => { // all stored user list from the db
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/users",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    if (activeTab === "private") {
      fetchUsers();
    } else {
      setSelectedUser(null); 
    }
  }, [activeTab]);

  return (
    <div className="d-flex vh-100">
      <div style={{ width: "8%", background: "#1e1e1e", color: "white" }}>
        <div className="p-3 text-center">
          <h6>Chat System <hr></hr> ID: {currentUser.ID}</h6>
        </div>
        <div className="p-2 text-center" onClick={() => setActiveTab("broadcast")} style={{ cursor: "pointer" }} > Broadcast </div>
        <div className="p-2 text-center" onClick={() => setActiveTab("private")} style={{ cursor: "pointer" }} >Private </div>
        <hr></hr>
        <div className="p-2 text-center" onClick={handleLogout} style={{ cursor: "pointer", color: "red", marginTop: "20px" }} >Logout</div>
      </div>

      <div style={{ width: "32%", borderRight: "1px solid #ddd" }}>
        {activeTab === "private" && users.map((u) => (
          <div key={u.id} className="p-2 border-bottom" style={{ cursor: "pointer" }} onClick={() => setSelectedUser(u.id)}>
            {u.display_name} (ID :{u.id})
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={{ width: "60%" }}>
        {activeTab === "broadcast" && <BroadcastChat />}
        {activeTab === "private" && selectedUser && (<PrivateChat receiverId={selectedUser} currentUserId={currentUser?.ID}/>)}
      </div>

    </div>
  );
}
