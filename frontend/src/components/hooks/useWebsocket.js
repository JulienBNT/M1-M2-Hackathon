import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import authService from "@components/services/authService";

const useWebSocket = () => {
    const [notifications, setNotifications] = useState([]);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:8080", {
          transports: ["websocket"],
        });
  
        const user = authService.getCurrentUser();
        if (user) {
          socketRef.current.emit("register", user._id);
        }
  
        socketRef.current.on("notification", (data) => {
          setNotifications((prev) => [data, ...prev]);
        });
  
        return () => {
          socketRef.current.disconnect();
        };
      }, []);
  
      return notifications;
};

export default useWebSocket;