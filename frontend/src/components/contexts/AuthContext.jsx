import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getCurrentUser();

        if (storedUser && authService.isAuthenticated()) {
          try {
            await authService.verifyToken();
            setCurrentUser(storedUser);
          } catch (err) {
            authService.logout();
          }
        }
      } catch (err) {
        console.error("Erreur d'initialisation auth:", err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.login(email, password);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || "Échec de connexion");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.register(username, email, password);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || "Échec d'inscription");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      authService.logout();
      setCurrentUser(null);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const result = await authService.updateProfile(userData);
      setCurrentUser(result.user);
      return result;
    } catch (err) {
      setError(err.error || "Échec de mise à jour du profil");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    setError(null);

    try {
      await authService.deleteAccount();
      setCurrentUser(null);
      navigate("/login");
    } catch (err) {
      setError(err.error || "Échec de suppression du compte");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const contextValue = {
    currentUser,
    loading,
    error,
    isAuthenticated: !!currentUser,
    login,
    register,
    logout,
    updateProfile,
    deleteAccount,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
