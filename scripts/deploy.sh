#!/bin/bash

# Exit on error
set -e

echo "[INFO] Initiating deployment process"

# Generate random JWT secret
generate_jwt_secret() {
    openssl rand -hex 64
}

# Environment setup
setup_env() {
    echo "[INFO] Configuring environment files"
    
    if [ ! -f backend/.env ]; then
        cp backend/.env.example backend/.env
        echo "[SUCCESS] Created backend environment file"
        
        JWT_SECRET=$(generate_jwt_secret)
        JWT_REFRESH_SECRET=$(generate_jwt_secret)
        
        sed -i "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" backend/.env
        sed -i "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" backend/.env
        
        echo "[SUCCESS] JWT secrets configured"
    else
        echo "[NOTICE] Backend environment file exists, skipping"
    fi
    
    if [ ! -f frontend/.env ]; then
        cp frontend/.env.example frontend/.env
        echo "[SUCCESS] Created frontend environment file"
    else
        echo "[NOTICE] Frontend environment file exists, skipping"
    fi

    cp backend/.env .env
}

# Docker configuration
setup_docker() {
    echo "[INFO] Initializing Docker environment"
    
    docker-compose pull
    docker-compose build
    docker-compose down
    docker-compose up -d
    docker image prune -f
    
    echo "[SUCCESS] Docker containers deployed"
}

# Main deployment process
main() {
    echo "[INFO] Verifying prerequisites"
    
    if ! command -v docker-compose &> /dev/null; then
        echo "[ERROR] docker-compose not found"
        exit 1
    fi
    
    setup_env
    setup_docker
    
    echo "[INFO] Deployment completed successfully"
    echo "[INFO] Container status:"
    docker-compose ps
    
    echo "[INFO] Container logs:"
    docker-compose logs -f
}

main