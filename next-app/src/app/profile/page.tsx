"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

import svgLogo from "/public/spotify.svg";
import styles from "@/styles/login.module.css";

export default function ProfilePage() {
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
      <div className="flex-1 w-full flex items-center justify-center px-6 py-16">
        <div className="max-w-sm w-full bg-zinc-800 rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-white text-3xl font-bold mb-6">Log in to Spotify</h1>


          <button
            className={`w-full ${styles.bgSpotifyGreen} hover:opacity-80 text-black font-bold py-3 px-4 rounded-full mb-4 shadow-md`}
          >
            LOG IN
          </button>

          <div className="mt-8 text-zinc-400">
            <p className="mb-4">Don't have an account?</p>
            <Link
              href="#"
              className="text-white hover:text-spotify-green border border-zinc-700 rounded-full py-3 px-8 inline-block font-bold transition-all duration-200"
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
