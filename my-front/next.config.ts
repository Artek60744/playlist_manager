import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'mosaic.scdn.co',
      'i.scdn.co',
      'image-cdn-ak.spotifycdn.com' // nouveau domaine à ajouter
    ],
  },
};

export default nextConfig;
