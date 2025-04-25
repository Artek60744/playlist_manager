## 1. Construire l’image Docker personnalisée
Place ton Dockerfile et ton init.sql dans le même dossier, puis exécute :
```bash
docker build -t spotify-postgres .
```
Cette commande construit une image nommée spotify-postgres à partir de ton Dockerfile.

## 2. Créer un volume Docker pour la persistance des données
```bash
docker volume create spotify-postgres-data
```
Cela garantit que tes données ne seront pas perdues si tu arrêtes ou supprimes le conteneur.

## 3. Lancer le conteneur avec le volume et les variables d’environnement
```bash
docker run --name spotify-db \
  -e POSTGRES_PASSWORD=motdepassefort \
  -e POSTGRES_USER=spotify_user \
  -e POSTGRES_DB=spotify_db \
  -v spotify-postgres-data:/var/lib/postgresql/data \
  -p 5432:5432 \
  -d spotify-postgres
```
**Explication :**
- --name spotify-db : nom du conteneur
- -e POSTGRES_PASSWORD=motdepassefort : mot de passe du superutilisateur
- -e POSTGRES_USER=spotify_user : nom d’utilisateur principal
- -e POSTGRES_DB=spotify_db : nom de la base créée au démarrage
- -v spotify-postgres-data:/var/lib/postgresql/data : persistance des données
- -p 5432:5432 : accès à PostgreSQL sur le port 5432
- -d : mode détaché (en arrière-plan)
- spotify-postgres : nom de l’image construit