import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import axios from "axios";
import { API_URL } from "@/config";
import type { UserProps } from "@/types/chat";

interface AuthContextType {
  user: UserProps | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (data: UserProps) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProps | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // load token/user from localStorage
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post(`${API_URL}/api/user/login`, { username, password });
    if (res.status === 200) {
      setUser(res.data.user);
      setToken(res.data.token);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } else {
      throw new Error(res.data.message || "Login failed");
    }
  };

  const signup = async (data: UserProps) => {
    const res = await axios.post(`${API_URL}/api/user/add`, data);
    if (res.status === 201) {
      // after signup, auto-login
      await login(data.username, data.password);
    } else {
      throw new Error(res.data.message || "Signup failed");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  console.log("user----",user)

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
