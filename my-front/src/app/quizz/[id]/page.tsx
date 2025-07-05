"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import TrackPlayer from "@/context/TrackPlayer";
import { useSpotifyPlayer } from "@/context/SpotifyPlayerContext";

interface Track {
  trackName: string;
  artist: string;
  album: string;
  imageUrl: string;
  url: string;
}

export default function PlaylistTracksPage() {
  const { id } = useParams();
  const { isPlayerReady } = useSpotifyPlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [result, setResult] = useState<string | null>(null);

  // 🔁 Récupération des morceaux
  const fetchTracks = async () => {
    const token = localStorage.getItem("authToken");
    if (!token || !id) return setLoading(false);

    try {
      const res = await fetch(`http://127.0.0.1:5000/quizz/playlists/${id}/tracks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTracks(data.tracks || []);
    } catch (err) {
      console.error("Erreur de récupération des morceaux :", err);
    } finally {
      setLoading(false);
    }
  };

  // ▶️ Lancer la récupération une fois que le lecteur est prêt
  useEffect(() => {
    if (isPlayerReady) fetchTracks();
  }, [isPlayerReady, id]);

  // 🎯 Sélectionne un morceau aléatoire
  useEffect(() => {
    if (!loading && tracks.length) {
      const valid = tracks.filter((t) => t.url);
      const random = valid[Math.floor(Math.random() * valid.length)];
      setCurrentTrack(random);
      setResult(null);
      setSongName("");
      setArtistName("");
    }
  }, [loading, tracks]);

  const checkAnswer = () => {
    if (!currentTrack) return;
    const correctTitle = songName.trim().toLowerCase() === currentTrack.trackName.toLowerCase();
    const correctArtist = artistName.trim().toLowerCase() === currentTrack.artist.toLowerCase();

    setResult(
      correctTitle && correctArtist
        ? "✅ Bravo, bonne réponse !"
        : `❌ Raté ! C'était "${currentTrack.trackName}" par ${currentTrack.artist}`
    );
  };

  const nextSong = () => {
    const otherTracks = tracks.filter((t) => t.url && t !== currentTrack);
    const next = otherTracks[Math.floor(Math.random() * otherTracks.length)];
    setCurrentTrack(next);
    setResult(null);
    setSongName("");
    setArtistName("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-zinc-900 flex flex-col items-center">
      <header className="w-full border-b border-zinc-800 py-8 text-center text-white font-bold">
        <h1 className="text-xl">Blind Test Spotify 🎵</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full">
        {loading ? (
          <p className="text-zinc-400">Chargement des morceaux...</p>
        ) : currentTrack ? (
          <>
            <Image
              src={currentTrack.imageUrl}
              alt="Pochette album"
              width={200}
              height={200}
              className="rounded mb-4"
            />
            <TrackPlayer trackUri={currentTrack.url} />

            <div className="w-full max-w-md mt-6">
              <input
                type="text"
                placeholder="Nom de la chanson"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-zinc-800 text-white"
              />
              <input
                type="text"
                placeholder="Nom de l'artiste"
                value={artistName}
                onChange={(e) => setArtistName(e.target.value)}
                className="w-full p-2 mb-4 rounded bg-zinc-800 text-white"
              />
              <button
                onClick={checkAnswer}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Valider la réponse
              </button>

              {result && (
                <div className="mt-4 text-white text-center">
                  <p>{result}</p>
                  <button
                    onClick={nextSong}
                    className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-zinc-400">Aucun extrait musical disponible.</p>
        )}
      </main>

      <footer className="w-full py-4 text-center text-xs text-zinc-500">
        <p>Ce site est une démo. Ce n'est pas Spotify officiel.</p>
      </footer>
    </div>
  );
}
