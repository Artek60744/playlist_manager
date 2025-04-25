FROM postgres:15-alpine

# Variables d'environnement pour la configuration de base
ENV POSTGRES_USER=spotify_user
# The password should be provided at runtime using environment variables or Docker secrets
# ENV POSTGRES_PASSWORD=secure_password
ENV POSTGRES_DB=spotify_db

# Copie le script d'initialisation
COPY init.sql /docker-entrypoint-initdb.d/

# Port exposé
EXPOSE 5432
