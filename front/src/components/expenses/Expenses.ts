import axios from 'axios';
import type { ExpenseCreate } from './types';
const API_URL = 'http://localhost:4000/api/expenses';

export const getExpenses = () => axios.get(API_URL);
export const createExpense = (data: ExpenseCreate) => axios.post(API_URL, data);
export const updateExpense = (id: number, data: ExpenseCreate) => axios.put(`${API_URL}/${id}`, data);
export const deleteExpense = (id: number) => axios.delete(`${API_URL}/${id}`);

export interface Expense {
  category_id: number;
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

export interface Categories {
  id: number;
  name: string;
}