import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthContextType, User } from '../components/auth/types';
import { getUserProfile, loginUser, logoutUser, registerUser } from '../components/auth/authService';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    const userData = await loginUser(email, password);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const userData = await registerUser(name, email, password);
    setUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
