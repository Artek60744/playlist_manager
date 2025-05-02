import { Router } from 'express';
import { getUserPlaylists } from '../controllers/spotifyController';

const router = Router();

router.get('/playlists', getUserPlaylists);

export default router;