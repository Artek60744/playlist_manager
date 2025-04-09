import { Request, Response } from 'express';
import { generateAuthorizeURL, getAccessToken } from '../services/spotifyService';

export const login = (req: Request, res: Response) => {
  const scopes = ['user-read-private', 'user-read-email'];
  const authorizeURL = generateAuthorizeURL(scopes);
  res.redirect(authorizeURL);
};

export const callback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const accessToken = await getAccessToken(code);
    res.json({ accessToken });
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
