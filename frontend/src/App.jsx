import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import HomePage from "./Pages/HomePage";
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import AuthPage from "./pages/Auth/AuthPage";
import ChatPage from "./pages/ChatPage";

import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";
import AuthWatcher from "./components/AuthWatcher";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AuthWatcher />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route
          path="/auth"
          element={
            <AuthRedirect>
              <AuthPage />
            </AuthRedirect>
          }
        >
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
