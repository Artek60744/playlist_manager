"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import svgLogo from "/public/spotify.svg";
import styles from "@/styles/login.module.css";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const { setAuthToken } = useContext(AuthContext); // Utiliser le contexte

  const handleLogin = () => {
    const apiUri = process.env.API_URI || "http://127.0.0.1:5000"; // Valeur par défaut si API_URI n'est pas défini

    // Ouvre une nouvelle fenêtre pour l'authentification
    const loginWindow = window.open(
      `${apiUri}/spotify/login_window`, // URL de votre API pour le login
      "_blank", // Ouvre dans une nouvelle fenêtre
      "width=500,height=600"
    );

    // Ajoute un écouteur pour recevoir le message de la fenêtre pop-up
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== apiUri) {
        // Vérifie que le message provient de l'API
        console.warn("Message reçu d'une origine non autorisée :", event.origin);
        return;
      }

      console.log("Données reçues :", event.data); // Ajoutez ce log pour vérifier les données reçues

      const { accessToken, refreshToken, expiresIn } = event.data; // Récupère les deux tokens et expiresIn
      if (accessToken && refreshToken) {
        console.log("Appel de setAuthToken avec :", accessToken, refreshToken, expiresIn);
        // Utilise le contexte pour stocker les tokens et planifier le rafraîchissement
        setAuthToken(accessToken, refreshToken, expiresIn); // Assurez-vous que setAuthToken gère le refreshToken

        // Supprime l'écouteur une fois le message reçu
        window.removeEventListener("message", handleMessage);

        // Recharge la page actuelle
        //window.location.reload();
      }
    };

    window.addEventListener("message", handleMessage);

    // Vérifie périodiquement si la fenêtre a été fermée
    const interval = setInterval(() => {
      if (loginWindow && loginWindow.closed) {
        clearInterval(interval);
        window.removeEventListener("message", handleMessage); // Nettoie l'écouteur si la fenêtre est fermée
        setError("Login failed. Please try again.");
      }
    }, 1000); // Vérifie toutes les secondes
  };

  return (
    <div className="min-h-screen bg-spotify-black flex flex-col items-center">
      {/* Header */}
      <header className="w-full border-b border-zinc-800 py-8">
        <div className={`container mx-auto px-6 flex justify-center`}>
          <Link href="/" className={`flex items-center gap-2 `}>
            <Image src={svgLogo} alt="Spotify Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white">Spotify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full text-center">
          <h1 className="text-white text-3xl font-bold mb-10">Log in to Spotify</h1>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            className={`w-full ${styles.bgSpotifyGreen} hover:opacity-80 text-black font-bold py-3 px-4 rounded-full mb-4`}
          >
            LOG IN
          </button>

          <div className="mt-8 text-zinc-400">
            <p className="mb-4">Don't have an account?</p>
            <Link
              href="#"
              className="text-white hover:text-spotify-green border border-zinc-700 rounded-full py-3 px-8 inline-block font-bold"
            >
              SIGN UP FOR SPOTIFY
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-zinc-500">
        <p>This is a demo site. Not the real Spotify.</p>
      </footer>
    </div>
  );
}
