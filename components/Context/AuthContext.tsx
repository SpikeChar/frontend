import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType } from '../../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; wallet?: string } | null>(null);

  useEffect(() => {
    // Check local storage for persistent session simulation
    const storedAuth = localStorage.getItem('voxel_auth');
    if (storedAuth === 'true') {
      setIsLoggedIn(true);
      setUser({ name: 'DevUser', wallet: '0x71C...9A2' });
    }
  }, []);

  const login = () => {
    setIsLoggedIn(true);
    setUser({ name: 'DevUser', wallet: '0x71C...9A2' });
    localStorage.setItem('voxel_auth', 'true');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('voxel_auth');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
