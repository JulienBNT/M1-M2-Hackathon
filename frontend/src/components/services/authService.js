import axios from "axios";
import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
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
  register: async (lastname, firstname, username, email, password) => {
    try {
      const response = await api.post("/user/register", {
        lastname,
        firstname,
        username,
        email,
        password,
      });

      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("user", JSON.stringify(response.data.user), {
          secure: true,
          sameSite: "strict",
        });
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
      const response = await api.post("/user/login", {
        email,
        password,
      });

      if (response.data.token) {
        Cookies.set("token", response.data.token, {
          secure: true,
          sameSite: "strict",
        });
        Cookies.set("user", JSON.stringify(response.data.user), {
          secure: true,
          sameSite: "strict",
        });
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
    Cookies.remove("token");
    Cookies.remove("user");
  },

  getCurrentUser: () => {
    try {
      const user = Cookies.get("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error(
        "Erreur lors de l'analyse de l'utilisateur depuis les cookies:",
        error,
      );
      authService.logout();
      return null;
    }
  },

  updateUserInCookies: (user) => {
    try {
      Cookies.set("user", JSON.stringify(user), {
        secure: true,
        sameSite: "strict",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour des cookies:", error);
    }
  },

  getToken: () => {
    return Cookies.get("token");
  },

  isAuthenticated: () => {
    return !!Cookies.get("token");
  },

  verifyToken: async () => {
    try {
      const response = await api.get("/user/verify");
      return response.data.user;
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  api,
};

export default authService;
