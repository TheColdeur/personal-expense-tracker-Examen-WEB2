// front/src/components/userSetting/userSettingService.ts
import axios from "axios";
import { UserProfile } from "./types";



const API_URL = "http://localhost:4000/api/user";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
  },
});

export const getUserProfile = () =>
  axios.get<{ message: string; user: UserProfile }>(
    `${API_URL}/profile`,
    getAuthHeader()
  );

export const updateUserProfile = (data: {
  username?: string;
  email?: string;
}) => axios.put(`${API_URL}/profile`, data, getAuthHeader());

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => axios.put(`${API_URL}/change-password`, data, getAuthHeader());

export const deleteUserAccount = (data: { password: string }) =>
  axios.delete(`${API_URL}/account`, {
    ...getAuthHeader(),
    data,
  });
