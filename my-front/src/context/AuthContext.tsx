"use client"; // ⬅ OBLIGATOIRE
import React, { createContext, useEffect, useState } from "react";

interface AuthContextProps {
  authToken: string | null;
  setAuthToken: (token: string | null, expiresIn?: number) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  authToken: null,
  setAuthToken: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [authToken, setAuthTokenState] = useState<string | null>(null);

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      if (token) {
        setAuthTokenState(token);
      }
    }, []);


    const setAuthToken = (token: string | null, expiresIn?: number) => {
    console.log("setAuthToken", token, expiresIn);
    if (token) {
      localStorage.setItem("authToken", token);
      setAuthTokenState(token);

      if (expiresIn) {
        console.log("expiresIn", expiresIn);
        const expirationTime = Date.now() + expiresIn * 1000; // Convertir en millisecondes
        localStorage.setItem("authTokenExpiration", expirationTime.toString());
        scheduleTokenRefresh(expiresIn);
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authTokenExpiration");
      setAuthTokenState(null);
    }
  };

  const scheduleTokenRefresh = (expiresIn: number) => {
    const refreshTime = (expiresIn - 60) * 1000; // Rafraîchir 1 minute avant l'expiration
    setTimeout(async () => {
        console.log("Rafraîchissement du token...");
    //   try {
    //     const apiUri = process.env.API_URI || "http://127.0.0.1:5000";
    //     const response = await fetch(`${apiUri}/spotify/refresh_token`, {
    //       method: "POST",
    //       credentials: "include",
    //     });

    //     if (response.ok) {
    //       const data = await response.json();
    //       const { accessToken, expiresIn } = data;
    //       setAuthToken(accessToken, expiresIn);
    //     } else {
    //       console.error("Erreur lors du rafraîchissement du token :", response.statusText);
    //       setAuthToken(null);
    //     }
    //   } catch (error) {
    //     console.error("Erreur lors du rafraîchissement du token :", error);
    //     setAuthToken(null);
    //   }
    }, refreshTime);
  };

  useEffect(() => {
    const expirationTime = parseInt(localStorage.getItem("authTokenExpiration") || "0", 10);
    if (authToken && Date.now() < expirationTime) {
      const remainingTime = (expirationTime - Date.now()) / 1000; // Temps restant en secondes
      scheduleTokenRefresh(remainingTime);
    } else {
      setAuthToken(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
};