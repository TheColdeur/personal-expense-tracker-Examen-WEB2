import axios from "axios";
import type { Income, IncomeCreate } from "../income/types";

const API_URL = "http://localhost:4000/api/revenues";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  }
});

export const getIncomes = () => axiosInstance.get<{ revenues: Income[] }>("/");
export const getIncomeById = (id: number) => axiosInstance.get<{ revenue: Income }>(`/${id}`);
export const createIncome = (data: IncomeCreate) => axiosInstance.post<{ revenue: Income }>("/", data);
export const updateIncome = (id: number, data: IncomeCreate) => axiosInstance.put<{ revenue: Income }>(`/${id}`, data);
export const deleteIncome = (id: number) => axiosInstance.delete(`/${id}`);
export const getIncomeStats = (params?: { startDate?: string; endDate?: string; period?: string }) =>
  axiosInstance.get("/stats", { params });
