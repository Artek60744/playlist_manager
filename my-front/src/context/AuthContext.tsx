"use client"; // ⬅ OBLIGATOIRE
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  authToken: string | null;
  setAuthToken: (accessToken: string | null, refreshToken?: string | null, expiresIn?: number) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authToken: null,
  setAuthToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authToken, setAuthTokenState] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const expirationTime = parseInt(localStorage.getItem("authTokenExpiration") || "0", 10);

    if (token && Date.now() < expirationTime) {
      setAuthTokenState(token);
      const remainingTime = (expirationTime - Date.now()) / 1000; // Temps restant en secondes
      scheduleTokenRefresh(remainingTime, refreshToken);
    } else {
      if (window.location.pathname !== '/login') {
        setAuthToken(null);
      }
    }
  }, []);

  const setAuthToken = (accessToken: string | null, refreshToken?: string | null, expiresIn?: number) => {
    console.log("setAuthToken", accessToken, refreshToken, expiresIn);
    if (accessToken) {
      localStorage.setItem("authToken", accessToken);
      setAuthTokenState(accessToken);

      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      console.log("expiresIn:", expiresIn);
      if (expiresIn) {
        const expirationTime = Date.now() + expiresIn * 1000;
        localStorage.setItem("authTokenExpiration", expirationTime.toString());
        scheduleTokenRefresh(expiresIn, refreshToken);
      } else {
        console.warn("expiresIn est trop court ou invalide :", expiresIn);
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("authTokenExpiration");
      setAuthTokenState(null);

      // Évitez de rediriger si l'utilisateur est déjà sur /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
  };

  const scheduleTokenRefresh = (expiresIn: number, refreshToken?: string | null) => {
    const refreshTime = (expiresIn - 60) * 1000; // Rafraîchir 1 minute avant l'expiration
    setTimeout(async () => {
      if (refreshToken) {
        console.log("Rafraîchissement du token...");
        try {
          const apiUri = process.env.API_URI || "http://127.0.0.1:5000";
          const response = await fetch(`${apiUri}/spotify/refreshToken?refreshToken=${refreshToken}`, {
            method: "GET", // Utilisez GET au lieu de POST
          });

          if (response.ok) {
            const data = await response.json();
            const { accessToken, expiresIn } = data;
            setAuthToken(accessToken, refreshToken, expiresIn);
          } else {
            console.error("Erreur lors du rafraîchissement du token :", response.statusText);
            setAuthToken(null);
          }
        } catch (error) {
          console.error("Erreur lors du rafraîchissement du token :", error);
          setAuthToken(null);
        }
      }
    }, refreshTime);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};