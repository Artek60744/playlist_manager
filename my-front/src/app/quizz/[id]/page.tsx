"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSpotifyPlayer } from "@/context/SpotifyPlayerContext";

interface Track {
  trackName: string;
  artist: string;
  album: string;
  imageUrl: string;
  previewUrl: string;
}

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

const pausePlayback = async (accessToken: string) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise en pause");
    }

    console.log("⏸️ Lecture mise en pause !");
  } catch (error) {
    console.error("Erreur lors de la mise en pause :", error);
  }
};

const MyComponent = () => {
  const { deviceId } = useSpotifyPlayer();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!deviceId) {
      console.warn("Le device ID n'est pas encore disponible");
      return;
    }

    console.log("Le device ID est prêt :", deviceId);
    // Effectuez des actions ici
  }, [deviceId]);

  const handlePlay = () => {
    if (!deviceId || !token) {
      console.error("Le lecteur ou le token n'est pas disponible");
      return;
    }

    const trackUri = "spotify:track:4uLU6hMCjMI75M1A2tKUQC"; // URI du morceau
    playTrack(token, deviceId, trackUri);
  };

  return (
    <button onClick={handlePlay} className="bg-green-600 text-white px-4 py-2 rounded">
      Lire un morceau
    </button>
  );
};

export default function PlaylistTracksPage() {
  const { id } = useParams();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  const [songName, setSongName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No authToken found in localStorage");
      setLoading(false);
      return;
    }

    const fetchTracks = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:5000/quizz/playlists/${id}/tracks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'appel à l'API");
        }

        const data = await res.json();
        console.log("Données récupérées :", data); // Ajout du log pour afficher "data"
        setTracks(data.tracks || []);
      } catch (error) {
        console.error("Erreur de récupération des morceaux :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [id]);

  useEffect(() => {
    if (!loading && tracks.length > 0) {
      const validTracks = tracks.filter((t) => t.previewUrl);
      if (validTracks.length > 0) {
        const randomTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
        setCurrentTrack(randomTrack);
        setResult(null);
        setSongName("");
        setArtistName("");
      }
    }
  }, [loading, tracks]);

  const checkAnswer = () => {
    if (!currentTrack) return;

    const isCorrectTitle =
      songName.toLowerCase().trim() === currentTrack.trackName.toLowerCase().trim();
    const isCorrectArtist =
      artistName.toLowerCase().trim() === currentTrack.artist.toLowerCase().trim();

    if (isCorrectTitle && isCorrectArtist) {
      setResult("✅ Bravo, bonne réponse !");
    } else {
      setResult(`❌ Raté ! C'était "${currentTrack.trackName}" par ${currentTrack.artist}`);
    }
  };

  const nextSong = () => {
    const validTracks = tracks.filter((t) => t.previewUrl && t !== currentTrack);
    if (validTracks.length > 0) {
      const newTrack = validTracks[Math.floor(Math.random() * validTracks.length)];
      setCurrentTrack(newTrack);
      setResult(null);
      setSongName("");
      setArtistName("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-zinc-900 flex flex-col items-center">
      <header className="w-full border-b border-zinc-800 py-8">
        <div className="container mx-auto px-6 flex justify-center">
          <h1 className="text-xl font-bold text-white">Blind Test Spotify 🎵</h1>
        </div>
      </header>

      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-16">
        {loading ? (
          <p className="text-zinc-400">Chargement des morceaux...</p>
        ) : currentTrack ? (
          <>
            <div className="text-center mb-6">
              <Image
                src={currentTrack.imageUrl || "/default-track.png"}
                alt="Pochette album"
                width={200}
                height={200}
                className="rounded mx-auto mb-4"
              />
              <audio controls autoPlay src={currentTrack.previewUrl} />
            </div>

            <div className="w-full max-w-md">
              <div className="mb-4">
                <label className="block text-white mb-2">Nom de la chanson</label>
                <input
                  type="text"
                  value={songName}
                  onChange={(e) => setSongName(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Entrez le nom de la chanson"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white mb-2">Nom de l'artiste</label>
                <input
                  type="text"
                  value={artistName}
                  onChange={(e) => setArtistName(e.target.value)}
                  className="w-full p-2 rounded bg-zinc-800 text-white"
                  placeholder="Entrez le nom de l'artiste"
                />
              </div>
              <button
                onClick={checkAnswer}
                className="w-full bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
        <MyComponent />
      </div>

      <footer className="w-full py-4 text-center text-xs text-zinc-500">
        <p>Ce site est une démo. Ce n'est pas Spotify officiel.</p>
      </footer>
    </div>
  );
}
