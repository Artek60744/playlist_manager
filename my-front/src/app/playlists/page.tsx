"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

import svgLogo from "@../public/spotify-logo.svg";
import styles from "@/styles/login.module.css";

export default function PlaylistPage() {
  interface Playlist {
    id: string;
    name: string;
    images: { url: string }[];
    tracks: { total: number };
    external_urls: { spotify: string };
  }

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.warn("No authToken found in localStorage");
      setLoading(false);
      return;
    }

    const fetchPlaylists = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/quizz/playlists", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Erreur lors de l'appel à l'API");
        }

        const data = await res.json();
        setPlaylists(data.playlists || []);
      } catch (error) {
        console.error("Erreur de récupération des playlists :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-spotify-black to-zinc-900 flex flex-col items-center">
      {/* Header */}
      <header className="w-full border-b border-zinc-800 py-8">
        <div className="container mx-auto px-6 flex justify-center">
          <Link href="/" className="flex items-center gap-2">
            <Image src={svgLogo} alt="Spotify Logo" width={40} height={40} />
            <span className="text-xl font-bold text-white">Spotify</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 w-full flex flex-col items-center justify-center px-6 py-16">
        <h1 className="text-white text-3xl font-bold mb-10">Vos Playlists</h1>

        {loading ? (
          <p className="text-zinc-400">Chargement des playlists...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <a
                  key={playlist.id}
                  href={playlist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-800 rounded-lg p-4 flex flex-col items-center text-center hover:bg-zinc-700 transition-all"
                >
                  <Image
                    src={playlist.images[0]?.url || "/default-playlist.png"}
                    alt={playlist.name}
                    width={200}
                    height={200}
                    className="rounded mb-4 object-cover"
                  />
                  <h2 className="text-white font-semibold text-lg">
                    {playlist.name}
                  </h2>
                  <p className="text-zinc-400 text-sm">
                    {playlist.tracks?.total || 0} titres
                  </p>
                </a>
              ))
            ) : (
              <p className="text-zinc-400">Aucune playlist trouvée.</p>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-xs text-zinc-500">
        <p>Ce site est une démo. Ce n'est pas Spotify officiel.</p>
      </footer>
    </div>
  );
}
