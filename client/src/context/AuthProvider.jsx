import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import api from "../api/api";

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bookflowUser");

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const token = localStorage.getItem("bookflowToken");

      if (!token) {
        setAuthLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");

        setUser(data.user);
        localStorage.setItem("bookflowUser", JSON.stringify(data.user));
      } catch (error) {
        console.error("Load current user error:", error);
        localStorage.removeItem("bookflowToken");
        localStorage.removeItem("bookflowUser");
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const register = async ({ name, email, password }) => {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("bookflowToken", data.token);
      localStorage.setItem("bookflowUser", JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
        role: data.user.role,
      };
    } catch (error) {
      console.error("Register error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Could not create account.",
      };
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("bookflowToken", data.token);
      localStorage.setItem("bookflowUser", JSON.stringify(data.user));
      setUser(data.user);

      return {
        success: true,
        role: data.user.role,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: error.response?.data?.message || "Invalid email or password.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("bookflowToken");
    localStorage.removeItem("bookflowUser");
    setUser(null);
  };

 const updateProfile = async (profileData) => {
   try {
     const { data } = await api.patch("/users/profile", profileData);

     setUser(data.user);
     localStorage.setItem("bookflowUser", JSON.stringify(data.user));

     return {
       success: true,
       user: data.user,
     };
   } catch (error) {
     console.error("Update profile error:", error);

     return {
       success: false,
       message: error.response?.data?.message || "Could not update profile.",
     };
   }
 };
  const value = {
    user,
    users: [],
    register,
    login,
    logout,
    updateProfile,
    authLoading,
    isLoggedIn: Boolean(user),
    isAdmin: user?.role === "admin",
    isCustomer: user?.role === "customer",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
