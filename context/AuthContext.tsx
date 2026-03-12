'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// === TYPES ===
// Describes the shape of user data we store after login
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Describes what AuthContext provides to all components
interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

// === CREATE CONTEXT ===
// This is like creating an empty "box" that will hold auth data
const AuthContext = createContext<AuthContextType | null>(null);

// === PROVIDER COMPONENT ===
// Wraps the entire app and provides auth data to all children
export function AuthProvider({ children }: { children: ReactNode }) {
  // State: token and user data
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // On first render: read saved data from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Called after successful login or registration
  function login(newToken: string, newUser: User) {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }

  // Called when user clicks "Log Out"
  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// === HOOK ===
// Shortcut for any component to access auth data
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
