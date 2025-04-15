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
  return data.body.access_token;
};

// export const refreshAccessToken = async () => {
//   const data = await spotifyApi.refreshAccessToken();
//   spotifyApi.setAccessToken(data.body.access_token);
//   return data.body.access_token;
// };

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