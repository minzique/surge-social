<div align="center">
  <img src="frontend/public/favicon.ico" alt="Surge Social" width="75"/>
  <h1 >Surge Social</h1>
  <p>A full-stack social media application built with TypeScript, React, and Node.js</p>
</div>

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)


## Project Progress

### Authentication & Security

- [x] Register screen implementation
- [x] Login screen implementation
- [x] reCAPTCHA integration for login/registration
- [x] Username/email and password authentication
- [x] Input validation for all fields
- [x] JWT-based authentication with Passport.js
- [x] Protected routes implementation

### Posts & Timeline

- [x] Protected listing page for posts
- [x] Post creation with image upload
- [x] Post viewing functionality
- [x] Timeline implementation
- [x] Time-based post indexing
- [x] Like functionality
- [x] Ranking algorithm for posts (time + likes weighted)
- [ ] Image upload with S3 integration


### Infrastructure & Deployment

- [x] MongoDB database integration
- [x] Docker configuration with multi-stage builds
- [x] Multi-container setup with docker-compose
- [x] Environment configuration management
- [x] Production SSL/TLS with Nginx reverse proxy
- [x] Domain configuration and DNS setup
- [x] VPS deployment with Docker
- [x] Automated SSL certificate renewal with Certbot
- [x] Basic unit tests with Jest
- [ ] CI/CD pipeline setup
- [ ] Rate limiting implementation
- [ ] Redis caching layer
- [ ] Load balancing configuration
- [ ] Monitoring and logging (ELK Stack)
- [ ] Backup automation
- [ ] API documentation with Swagger/OpenAPI

### Features & Enhancements

- [x] User authentication system
- [x] JWT token management
- [x] Protected routes and authorization
- [x] Post creation and viewing
- [x] Image upload for posts
- [x] Like/unlike functionality
- [x] User profiles (basic)
- [x] Timeline with ranking algorithm
- [x] Input validation and error handling
- [ ] User avatars and profile customization
- [ ] Comment functionality on posts
- [ ] Post sharing capability
- [ ] User following/followers
- [ ] Anonymous login implementation

### Production Environment

- Domain: surgesocial.app
- Hosting: Vultr VPS with Docker
- Database: MongoDB
- SSL: Let's Encrypt with auto-renewal
- Proxy: Nginx reverse proxy
- Container Orchestration: Docker Compose

## Development Setup

### Local Development
1. Copy `.env.example` to `.env` and configure environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```bash
2. Start your local MongoDB instance
3. Install dependencies and start services:

# Backend
cd backend
npm install
npm run dev

# Frontend (in another terminal)
cd frontend
npm install
npm run dev
```

### Docker Development
If you're using Docker (non-macOS), the same configuration works with Docker Compose:

1. Copy `.env.example` to `.env` and configure environment variables:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
2. Start the services:
```bash
docker-compose up
```

The Docker setup includes:
- Volume mounts for live code updates
- Network isolation between services
- Port mapping for local access
- Environment variable support from .env file

## Deployment

### Prerequisites
- Docker and Docker Compose installed
- Domain DNS configured to point to VPS
- SSH access to VPS
- SSL certificates (automated via Certbot)

### Automated Deployment

1. SSH into VPS:
```bash
ssh user@surgesocial.app
```
2. Clone repository:
```bash
git clone https://github.com/minzique/surge-social.git
cd surge-social
```
3. Configure environment and update `.env` with required values:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```
4. Run deployment script:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```
The script handles:
- SSL certificate generation
- Docker image builds
- Service orchestration
- Nginx configuration


## Technical Architecture

### Backend (Node.js + TypeScript)
- Express.js for REST API
- MongoDB with Mongoose
- Middleware implementation for:
  - Authentication
  - Validation
  - Error handling
  - reCAPTCHA verification
- Unit tests with Jest

### Frontend (React + TypeScript)
- Vite as build tool
- React Router for navigation
- Custom hooks and components
- Shared types with backend

### Environment Variables
All environment variables are managed in a single `.env` file:
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_PORT`: Frontend development server port (default: 3000)
- `BACKEND_PORT`: Backend container exposed port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `RECAPTCHA_SECRET_KEY`: Google reCAPTCHA secret key
- `RECAPTCHA_SITE_KEY`: Google reCAPTCHA site key

## Project Structure
```
surge-social/
├── backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── dtos/          # Data Transfer Objects
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/           # API integration
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── types/         # TypeScript types
├── docker/                # Docker configuration
└── scripts/               # Development scripts
