"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SpotifyContextType {
  deviceId: string | null;
  player: Spotify.Player | null;
}

const SpotifyContext = createContext<SpotifyContextType>({
  deviceId: null,
  player: null,
});

export const useSpotifyPlayer = () => useContext(SpotifyContext);

export const SpotifyPlayerProvider = ({ children }: { children: React.ReactNode }) => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [player, setPlayer] = useState<Spotify.Player | null>(null);

  useEffect(() => {
  const token = localStorage.getItem("authToken");
  if (!token) return;

  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;

  script.onload = () => {
    if (window.Spotify) {
      const spotifyPlayer = new window.Spotify.Player({
        name: "Blind Test Player",
        getOAuthToken: cb => cb(token),
        volume: 0.5,
      });

      spotifyPlayer.addListener("ready", ({ device_id }: { device_id: string }) => {
        console.log("✅ Spotify Player prêt avec ID :", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer.addListener("initialization_error", ({ message }: { message: string }) =>
        console.error("Erreur init SDK :", message)
      );

      spotifyPlayer.addListener("authentication_error", ({ message }: { message: string }) =>
        console.error("Erreur d'authentification :", message)
      );

      spotifyPlayer.addListener("account_error", ({ message }: { message: string }) =>
        console.error("Erreur de compte :", message)
      );

      spotifyPlayer.addListener("playback_error", ({ message }: { message: string }) =>
        console.error("Erreur de lecture :", message)
      );

      spotifyPlayer.connect();
      setPlayer(spotifyPlayer);
    }
  };

  document.body.appendChild(script);
}, []);


  return (
    <SpotifyContext.Provider value={{ deviceId, player }}>
      {children}
    </SpotifyContext.Provider>
  );
};

const playTrack = async (accessToken: string, deviceId: string, trackUri: string) => {
  try {
    const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uris: [trackUri], // URI du morceau à lire
      }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors du démarrage de la lecture");
    }

    console.log("🎵 Lecture démarrée !");
  } catch (error) {
    console.error("Erreur lors de la lecture :", error);
  }
};
