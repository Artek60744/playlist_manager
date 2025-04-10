import express from 'express';
import { login, callback, getPlayerStatus } from '../controllers/spotifyController';

const router = express.Router();

router.get('/login', login);
router.get('/callback', callback);
router.get('/player/devices', getPlayerStatus);

export default router;
