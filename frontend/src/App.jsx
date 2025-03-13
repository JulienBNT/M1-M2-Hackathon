import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/contexts/AuthContext.jsx";
import { NotificationProvider } from "@/components/contexts/NotificationContext.jsx";
import LoginPage from "@/components/pages/Authentication/Login/LoginPage.jsx";
import RegisterPage from "@pages/Authentication/Register/RegisterPage.jsx";
import NotFoundPage from "@pages/error/NotFoundPage.jsx";
import Layout from "@/components/Layout/Layout.jsx";
import Home from "@pages/Home/Home.jsx";
import ProtectedRoute from "@common/ProtectedRoute.jsx";

// Importation des composants de profil
import ProfileLayout from "@pages/Profil/ProfilePage.jsx";
import MyPosts from "@pages/Profil/MyPosts.jsx";
import SavedPosts from "@pages/Profil/SavedPosts.jsx";
import ProfileSettings from "@pages/Profil/ProfileSettings.jsx";
import Recommend from "@pages/Recommend/Recommend.jsx";
import NotificationPage from "@pages/Notifications/NotificationPage.jsx";
import Future from "@pages/Future/Future.jsx";
import io from "socket.io-client";
import React, { useEffect } from "react";

const SOCKET_ENDPOINT = "http://127.0.0.1:5000"; 

const App = () => {

  // connexion au websocket
  useEffect(() => {
    const socket = io(SOCKET_ENDPOINT);
   
    socket.on("connect", () => {
      console.log("Connected to Flask SocketIO server");
    });

    socket.on("message", (data) => {
      console.log("Socket message received:", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Routes protégées */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="notifications" element={<NotificationPage />} />
              <Route path="recommend" element={<Recommend />} />
              <Route path="future" element={<Future />} />

              {/* Routes du profil */}
              <Route path="profile" element={<ProfileLayout />}>
                <Route index element={<MyPosts />} />
                <Route path="saved" element={<SavedPosts />} />
                <Route path="settings" element={<ProfileSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Erreur 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
