import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch("/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Registered successfully");
        // redirect to login after short delay
        setTimeout(() => navigate("/login"), 1000);
      } else {
        setMessage(data.message || data.error || "Registration failed");
      }
    } catch (err) {
      setMessage("Network error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Register</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input className="form-control" name="name" value={form.name} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" name="email" value={form.email} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input className="form-control" name="phone" value={form.phone} onChange={handleChange} />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input className="form-control" name="address" value={form.address} onChange={handleChange} />
        </div>
        <button className="btn btn-primary" type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
