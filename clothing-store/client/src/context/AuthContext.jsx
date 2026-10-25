import {
  useEffect,
  useState
} from "react";

import api from "../services/api";
import {
  AuthContext
} from "./AuthContextValue";

function AuthProvider({
  children
}) {
  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response =
          await api.get("/auth/me");

        setUser(response.data);
      } catch {
        localStorage.removeItem(
          "token"
        );
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (
    token,
    userData
  ) => {
    localStorage.setItem(
      "token",
      token
    );

    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(
      "token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;