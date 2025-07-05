import SpotifyWebApi from 'spotify-web-api-node';

const getSpotifyApi = (redirectUri: string | undefined) => {
  return new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri,
  });
};

// Pour l'authentification principale
export const generateAuthorizeURL = (scopes: string[]) => {
  const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI);
  return spotifyApi.createAuthorizeURL(scopes);
};

// Pour l'authentification via pop-up/fenêtre
export const generateAuthorizeURL_Window = (scopes: string[]) => {
  const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI_WINDOW);
  return spotifyApi.createAuthorizeURL(scopes);
};

export const getAccessToken = async (code: string, useWindow = false) => {
  const redirectUri = useWindow
    ? process.env.SPOTIFY_REDIRECT_URI_WINDOW
    : process.env.SPOTIFY_REDIRECT_URI;
  const spotifyApi = getSpotifyApi(redirectUri);

  const data = await spotifyApi.authorizationCodeGrant(code);
  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);
  return {
    accessToken: data.body.access_token,
    refreshToken: data.body.refresh_token,
    expiresIn: data.body.expires_in, // Ajout de la durée d'expiration
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI);
  spotifyApi.setRefreshToken(refreshToken);

  try {
    const data = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(data.body.access_token);

    return {
      accessToken: data.body.access_token,
      refreshToken: refreshToken, // Spotify ne retourne pas toujours un nouveau refresh token
      expiresIn: data.body.expires_in, // Ajout de la durée d'expiration
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw new Error('Failed to refresh access token');
  }
};

export const getPlayerDevices = async (accessToken: string) => {
  try {
    const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI);
    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getMyDevices();
    return response.body.devices;
  } catch (error) {
    console.error('Error fetching player devices:', error);
    throw new Error('Failed to fetch player devices');
  }
};

export const getUserPlaylists = async (accessToken: string) => {
  try {
    const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI);
    spotifyApi.setAccessToken(accessToken);

    const response = await spotifyApi.getUserPlaylists(); // Utilisation de la méthode dédiée
    return response.body.items; // Retourne les playlists
  } catch (error) {
    console.error('Error fetching user playlists:', error);
    throw new Error('Failed to fetch user playlists');
  }
};

export const fetchPlaylistTracks = async (accessToken: string, playlistId: string) => {
  try {
    const spotifyApi = getSpotifyApi(process.env.SPOTIFY_REDIRECT_URI);
    spotifyApi.setAccessToken(accessToken);
    const response = await spotifyApi.getPlaylistTracks(playlistId);

    // Utilisation de response.body.items au lieu de response.data.items
    return response.body.items.map((item: any) => ({
      trackName: item.track.name,
      artist: item.track.artists.map((artist: any) => artist.name).join(', '),
      album: item.track.album.name,
      imageUrl: item.track.album.images[0]?.url,
      duration: item.track.duration_ms,
      url: item.track.uri,
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw new Error('Failed to fetch playlist tracks');
  }
};