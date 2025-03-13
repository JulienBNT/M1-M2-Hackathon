import React, { createContext, useContext, useState, useEffect } from "react";
import useWebSocket from "@components/hooks/useWebSocket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { currentUser, isAuthenticated } = useAuth();
  const notifications = useWebSocket();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (notifications.length > 0) {
      setUnreadCount(prev => prev + 1);
    }
  }, [notifications.length]);

  const markAsRead = () => {
    setUnreadCount(0);
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};