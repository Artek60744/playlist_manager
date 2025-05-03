// src/types/spotify.d.ts

export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void;
    Spotify: any;
  }

  namespace Spotify {
    class Player {
      constructor(options: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
      });

      connect(): boolean;
      addListener(event: string, callback: (data: any) => void): boolean;
      removeListener(event: string): boolean;
    }
  }
}
