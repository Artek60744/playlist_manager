import { Request, Response } from 'express';
import { refreshAccessToken, generateAuthorizeURL, generateAuthorizeURL_Window, getAccessToken, getPlayerDevices } from '../services/spotifyService';

export const login = (req: Request, res: Response) => {
  const scopes = ['user-read-private',
     'user-read-email',
      'user-read-playback-state',
       'user-read-currently-playing'];
  const authorizeURL = generateAuthorizeURL(scopes);
  console.log(authorizeURL);
  res.redirect(authorizeURL);
};

export const refreshToken = async (req: Request, res: Response) => {
  const old_refreshToken = req.query.refreshToken as string;

  if (!old_refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }

  try {
    const { accessToken, refreshToken, expiresIn } = await refreshAccessToken(old_refreshToken);
    res.json({ accessToken, refreshToken, expiresIn }); // Inclure expiresIn dans la réponse
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
};

export const login_window = (req: Request, res: Response) => {
  const scopes = ['user-read-private',
     'user-read-email',
      'user-read-playback-state',
       'user-read-currently-playing'];
  const authorizeURL = generateAuthorizeURL_Window(scopes);
  console.log(authorizeURL);
  // Redirige vers l'URL d'autorisation de Spotify
  res.redirect(authorizeURL);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const { accessToken, refreshToken, expiresIn } = await getAccessToken(code);
    res.json({ accessToken, refreshToken, expiresIn });

  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};


export const callback_window = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const { accessToken, refreshToken, expiresIn } = await getAccessToken(code, true); // Récupère les deux tokens
    // console.log('Access Token:', accessToken);
    // HTML pour envoyer le token à la fenêtre principale
    const html = `
    <html>
      <body>
        <script>
          window.opener.postMessage({ 
            accessToken: "${accessToken}", 
            refreshToken: "${refreshToken}", 
            expiresIn: ${expiresIn} 
          }, "*");
          window.close();
        </script>
      </body>
    </html>
    `;
    res.send(html);

  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const getPlayerStatus = async (req: Request, res: Response) => {
  const accessToken = req.headers.authorization?.split(' ')[1]; // Récupère le token depuis le header Authorization

  if (!accessToken) {
    return res.status(401).json({ error: 'Access token is required' });
  }

  try {
    const devices = await getPlayerDevices(accessToken);
    res.json({ devices });
  } catch (error) {
    console.error('Error fetching player status:', error);
    res.status(500).json({ error: 'Failed to fetch player status' });
  }
};