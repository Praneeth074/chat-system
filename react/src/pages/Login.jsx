import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../middleware/Socket";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ // stringfy helps to convert js objects to json format strings
          email,
          password
        })
      });
      const response = await res.json(); // due to native api need to convert result into json
      if (!res.ok || !response.success) {
        alert("Login failed");
        return;
      }
      const token = response.data?.token; // check JWT token is sent or not
      if (!token) {
        alert("Token not received");
        return;
      }
      localStorage.setItem("token", token); // store in browser local storage
      const decoded = JSON.parse(atob(token.split(".")[1])); // token has 3 parts [header, payload, signature] we take INDEX 1(payload)
      localStorage.setItem("user", JSON.stringify(decoded)); // store them LS in browser
      connectSocket(token); // will get one socket connection ID
      navigate("/dashboard");

    } 
    catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Login</h3>
        <p className="text-center text-muted"> Fill form to enter into chat system</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email: </label>
            <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>

          <div className="mb-3">
             <label>Password: </label>
            <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <hr></hr>
        <div className="text-center mt-3">
          <span onClick={() => navigate("/register")} className="text-primary">Go to Register</span>
        </div>
      </div>
    </div>
  );
}
