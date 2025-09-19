// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Routes
import { SignupForm, LoginForm, LogoutButton } from "./Auths";
import { DisplayDashboard, PostsList } from "./Dashboard";
import Greeting from "./Greeting";
import PostDetail from "./PostDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Greeting />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <>
              <DisplayDashboard />
              <PostsList />
              <LogoutButton />
            </>
          }
        />
        <Route
          path="/posts/:id"
          element={
            <>
              <PostDetail />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
