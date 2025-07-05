// src/utils/spotify.ts

export const playTrack = async (accessToken: string, deviceId: string, trackUri: string) => {
    try {
      const res = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [trackUri] }),
      });
      if (!res.ok) throw new Error("Erreur de lecture");
      console.log("🎵 Lecture démarrée !");
    } catch (err) {
      console.error("Erreur lors de la lecture :", err);
    }
  };
  
  export const pausePlayback = async (accessToken: string) => {
    try {
      const res = await fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Erreur de pause");
      console.log("⏸️ Lecture mise en pause !");
    } catch (err) {
      console.error("Erreur lors de la mise en pause :", err);
    }
  };
  