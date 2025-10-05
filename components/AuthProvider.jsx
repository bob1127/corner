"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    if (storedToken) {
      setToken(storedToken);
      fetchUserInfo(storedToken);
    }
  }, []);

  const login = async ({ username, password }) => {
    const res = await fetch(
      "https://starislandbaby.com/wp-json/jwt-auth/v1/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      }
    );
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("jwt", data.token);
      setToken(data.token);
      fetchUserInfo(data.token);
      router.push("/profile");
    } else {
      throw new Error(data.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  const fetchUserInfo = async (jwt) => {
    const res = await fetch(
      "https://starislandbaby.com/wp-json/wp/v2/users/me",
      {
        headers: { Authorization: `Bearer ${jwt}` },
      }
    );
    const data = await res.json();
    if (res.ok) setUser(data);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
