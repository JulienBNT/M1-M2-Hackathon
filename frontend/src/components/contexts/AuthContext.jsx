import { createContext, useContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const register = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });
      setCurrentUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });
      setCurrentUser(response.data.user);
      return response.data;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await axios.post("/api/auth/logout");
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
