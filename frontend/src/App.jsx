import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AuthPage from "./pages/Auth/AuthPage";
import HomePage from "./Pages/HomePage";
import ChatPage from "./Pages/ChatPage";

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>
      <Route path="/" element={<HomePage />} />
      <Route path="/chats" element={<ChatPage />} />
    </Routes>
  );
}

export default App;
