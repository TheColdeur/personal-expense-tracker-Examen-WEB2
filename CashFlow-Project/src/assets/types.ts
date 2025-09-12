export interface User {
  email?: string;
  username?: string;
}

export interface AuthContextType {
  user: User;
  // autres propriétés comme login, logout, etc.
}