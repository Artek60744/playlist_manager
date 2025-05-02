import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';


dotenv.config({ path: __dirname + '/../.env' });

import spotifyRoutes from './routes/spotify';
import quizzRoutes from './routes/quizz';


const app = express();
// Configuration CORS pour permettre les requêtes de localhost:3000
const corsOptions = {
    origin: 'http://localhost:3000',  // Permet uniquement les requêtes venant de cette origine
    credentials: true,               // Permet l'envoi de cookies et autres informations d'authentification
  };
  
  app.use(cors(corsOptions));  // Appliquer la configuration CORS
app.use(express.json());

// Routes Spotify
app.use('/spotify', spotifyRoutes);

// Routes Quizz
app.use('/quizz', quizzRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


