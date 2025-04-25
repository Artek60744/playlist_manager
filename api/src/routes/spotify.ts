import express from 'express';
import { login, refreshToken, login_window, callback, callback_window, getPlayerStatus } from '../controllers/spotifyController';

const router = express.Router();

router.get('/login', login);
router.get('/refreshToken', refreshToken);
router.get('/login_window', login_window);
router.get('/callback', callback);
router.get('/callback_window', callback_window);
router.get('/player/devices', getPlayerStatus);

export default router;
