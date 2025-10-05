// components/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_WP_API_BASE_URL;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      console.log("✅ Token found in localStorage:", storedToken);
      setToken(storedToken);
      fetchUserInfo(storedToken);
    } else {
      console.log("❌ No token found in localStorage");
    }
  }, []);

  const fetchUserInfo = async (jwt) => {
    try {
      const res = await fetch(`${API_BASE_URL}/wp-json/wp/v2/users/me`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`❌ fetchUserInfo failed: ${res.status} ${errorText}`);
        return;
      }

      const data = await res.json();
      if (!data.code) {
        console.log("✅ User info fetched:", data);
        setUserInfo(data);
      } else {
        console.warn("⚠️ Unexpected response:", data);
      }
    } catch (err) {
      console.error("❌ Network error in fetchUserInfo:", err);
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setToken(null);
    setUserInfo(null);
    console.log("🔓 Logged out");
  };

  return (
    <UserContext.Provider value={{ token, userInfo, setToken, setUserInfo, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
