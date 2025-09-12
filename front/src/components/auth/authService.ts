import type { User } from "./types";

// Simule une base utilisateur
let mockUser: User = {
  id: '1',
  name: 'Novah',
  email: 'novah@cashflow.dev',
  avatarUrl: 'https://i.pravatar.cc/150?u=novah',
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  // Simule une requête réseau
  await new Promise((res) => setTimeout(res, 800));

  if (email === mockUser.email && password === 'demo123') {
    return mockUser;
  } else {
    throw new Error('Email ou mot de passe incorrect');
  }
};

export const registerUser = async (
  name: string,
  email: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _password: string
): Promise<User> => {
  await new Promise((res) => setTimeout(res, 800));

  mockUser = {
    id: String(Date.now()),
    name,
    email,
    avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
  };

  return mockUser;
};

export const logoutUser = async (): Promise<void> => {
  await new Promise((res) => setTimeout(res, 500));
  mockUser = {
    id: '',
    name: '',
    email: '',
    avatarUrl: '',
  };
};

export const getUserProfile = async (): Promise<User> => {
  await new Promise((res) => setTimeout(res, 500));

  if (!mockUser || !mockUser.email) {
    throw new Error('Utilisateur non connecté');
  }

  return mockUser;
};
