import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      authService.logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

const authService = {
  register: async (username, email, password) => {
    try {
      const response = await api.post("user/register", {
        username,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Une erreur s'est produite lors de l'inscription",
        }
      );
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post("user/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Une erreur s'est produite lors de la connexion",
        }
      );
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    try {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(
        "Erreur lors de l'analyse de l'utilisateur depuis localStorage:",
        error,
      );
      authService.logout();
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  verifyToken: async () => {
    try {
      const response = await api.get("user/verify");
      return response.data.user;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put("user/me", userData);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Une erreur s'est produite lors de la mise à jour du profil",
        }
      );
    }
  },

  deleteAccount: async () => {
    try {
      const response = await api.delete("user/me");
      authService.logout();
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          error: "Une erreur s'est produite lors de la suppression du compte",
        }
      );
    }
  },

  api,
};

export default authService;
