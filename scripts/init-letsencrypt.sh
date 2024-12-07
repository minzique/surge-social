#!/bin/bash

# Create directories
mkdir -p ssl certbot/www

# Stop nginx if running
docker-compose down

# Get certificates
docker-compose run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email hello@minzique.net \
  --agree-tos \
  --no-eff-email \
  -d surgesocial.app \
  -d www.surgesocial.app

# Start services
docker-compose up -d