import SpotifyWebApi from 'spotify-web-api-node';

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const generateAuthorizeURL = (scopes: string[]) => {
  return spotifyApi.createAuthorizeURL(scopes);
};

export const getAccessToken = async (code: string) => {
  const data = await spotifyApi.authorizationCodeGrant(code);
  spotifyApi.setAccessToken(data.body.access_token);
  spotifyApi.setRefreshToken(data.body.refresh_token);
  return data.body.access_token;
};

export const refreshAccessToken = async () => {
  const data = await spotifyApi.refreshAccessToken();
  spotifyApi.setAccessToken(data.body.access_token);
  return data.body.access_token;
};
