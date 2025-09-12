import axios from "axios";
import type { AuthResponse, LoginData, SignupData, User } from "../components/auth/types";

const API_BASE_URL = "http://localhost:8080/api/auth";

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const authService = {
  login: async (loginData: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/login", loginData);
    return response.data;
  },

  signup: async (signupData: SignupData): Promise<AuthResponse> => {
    const response = await api.post("/signup", signupData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem("token");
    await api.get("/logout", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getUserInfo: async (): Promise<{ user: User }> => {
    const token = localStorage.getItem("token");
    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem("token");
    if(token){
      return true;
    }
    return false;
  },

  getStoredUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
}