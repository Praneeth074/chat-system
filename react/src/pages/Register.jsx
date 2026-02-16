import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    display_name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const response = await res.json();

      if (!res.ok || !response.success) {
        alert(response.message || "Registration failed");
        return;
      }

      alert("Registration successful. Please login.");
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h3 className="text-center mb-3">Registration Form</h3>
        <p className="text-center text-muted">
          Fill form to enter into chat system
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              maxLength={100}
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="text"
              name="display_name"
              className="form-control"
              placeholder="Display Name"
              maxLength={100}
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              required
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <span
            onClick={() => navigate("/")}
            className="text-primary"
            style={{ cursor: "pointer" }}
          >
            Go to Login
          </span>
        </div>
      </div>
    </div>
  );
}
