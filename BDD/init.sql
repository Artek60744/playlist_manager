-- Table des utilisateurs
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT UNIQUE NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Table des playlists
CREATE TABLE Playlists (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT NOT NULL,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

-- Table des morceaux
CREATE TABLE Tracks (
    id SERIAL PRIMARY KEY,
    spotify_id TEXT NOT NULL,
    name TEXT NOT NULL,
    artist TEXT NOT NULL,
    preview_url TEXT,
    duration_ms INTEGER,
    audio_features JSONB
);

-- Table d'association Playlists <-> Tracks
CREATE TABLE PlaylistTracks (
    playlist_id INTEGER REFERENCES Playlists(id) ON DELETE CASCADE,
    track_id INTEGER REFERENCES Tracks(id) ON DELETE CASCADE,
    PRIMARY KEY (playlist_id, track_id)
);

-- Table des tags (propres à chaque utilisateur)
CREATE TABLE Tags (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    UNIQUE(user_id, name)
);

-- Table d'association Tracks <-> Tags (avec valeur personnalisée)
CREATE TABLE TrackTags (
    track_id INTEGER REFERENCES Tracks(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES Tags(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    value TEXT,
    PRIMARY KEY (track_id, tag_id, user_id)
);

-- Index pour accélérer les recherches fréquentes
CREATE INDEX idx_tracks_spotify_id ON Tracks(spotify_id);
CREATE INDEX idx_playlists_spotify_id ON Playlists(spotify_id);
CREATE INDEX idx_tags_user_id ON Tags(user_id);
CREATE INDEX idx_tracktags_user_id ON TrackTags(user_id);
