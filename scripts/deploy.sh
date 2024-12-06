#!/bin/bash

# Exit on any error
set -e

# Pull latest images
docker-compose pull

# Bring down the current stack (if any)
docker-compose down

# Start up the new stack
docker-compose up -d

# Clean up old images
docker image prune -f

# Show logs
docker-compose logs -f
