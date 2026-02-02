import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  badges: string[];
  studyPreferences: {
    startTime: string;
    endTime?: string;
    breakDuration: number;
    lunchTime?: string;
  };
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("learnova_user");
    const token = localStorage.getItem("learnova_token");
    if (token) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("learnova_token", token);
      localStorage.setItem("learnova_user", JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post("/api/auth/signup", { name, email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("learnova_token", token);
      localStorage.setItem("learnova_user", JSON.stringify(userData));

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("learnova_token");
    localStorage.removeItem("learnova_user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        const response = await axios.patch("/api/user/update", updates);
        setUser(response.data);
        localStorage.setItem("learnova_user", JSON.stringify(response.data));
      } catch (error) {
        console.error("Failed to update user", error);
      }
    }
  };

  const addXP = async (amount: number) => {
    if (user) {
      try {
        const response = await axios.patch("/api/user/xp", { amount });
        setUser(response.data);
      } catch (error) {
        console.error("Failed to add XP", error);
      }
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        addXP,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}