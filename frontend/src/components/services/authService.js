import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create();

api.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split(";")
      .find((c) => c.trim().startsWith("token="));
    if (token) {
      config.headers["Authorization"] = `Bearer ${token.split("=")[1]}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

const setCookie = (name, value, days = 7) => {
  const expires = new Date(
    Date.now() + days * 24 * 60 * 60 * 1000,
  ).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_URL + "login", { email, password });
      if (response.data.token) {
        setCookie("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (username, email, password) => {
    try {
      const response = await axios.post(API_URL + "register", {
        username,
        email,
        password,
      });
      if (response.data.token) {
        setCookie("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("token="));
  },

  api,
};

export default authService;
