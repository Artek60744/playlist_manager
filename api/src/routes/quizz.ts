import { Router } from 'express';
import { getPlaylistTracks, getUserPlaylists } from '../controllers/spotifyController';

const router = Router();

router.get('/playlists', getUserPlaylists);
router.get('/playlists/:id/tracks', getPlaylistTracks);


export default router;