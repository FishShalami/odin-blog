import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "./api";

function SignupForm() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("User created: " + JSON.stringify(data));
        navigate("/login");
      } else {
        alert("Failed to create new user");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Sign-up</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Create User</button>
      </form>
    </>
  );
}

function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  // 👇 If user already has valid cookies, skip login immediately
  useEffect(() => {
    (async () => {
      try {
        const res = await api("/api/me");
        if (res.ok) {
          navigate("/dashboard", { replace: true });
        }
      } catch {}
    })();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // if (request) contains refreshToken or accessToken, then redirect to the /dashboard

      const response = await api("/api/auth/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const user = data.user ?? data;
        navigate("/dashboard", { state: { user } });
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
}

function LogoutButton() {
  const navigate = useNavigate();
  const onClick = async () => {
    const response = await api("/api/auth/logout", { method: "POST" });
    if (response.ok) navigate("/login", { replace: true });
  };
  return <button onClick={onClick}>Logout</button>;
}

export { SignupForm, LoginForm, LogoutButton };
