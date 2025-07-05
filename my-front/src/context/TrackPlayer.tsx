// src/components/TrackPlayer.tsx
"use client";

import { useSpotifyPlayer } from "@/context/SpotifyPlayerContext";
import { playTrack } from "@/utils/spotify";

interface TrackPlayerProps {
  trackUri: string;
}

export default function TrackPlayer({ trackUri }: TrackPlayerProps) {
  const { deviceId } = useSpotifyPlayer();
  const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

  const handlePlay = () => {
    if (!deviceId || !token || !trackUri) {
      console.warn("Lecture impossible : device/token/URI manquant");
      return;
    }
    playTrack(token, deviceId, trackUri);
  };

  return (
    <button onClick={handlePlay} className="bg-green-600 text-white px-4 py-2 rounded">
      ▶️ Lire un morceau
    </button>
  );
}
