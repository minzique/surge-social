# Surge Social

A full-stack instagram-like application

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
- [x] Post creation functionality
- [x] Post viewing functionality
- [x] Timeline implementation
- [x] Time-based post indexing
- [ ] Like functionality
- [ ] Like-based post indexing

### Infrastructure & Deployment
- [x] MongoDB database integration
- [x] Docker configuration
- [x] Multi-container setup with docker-compose
- [x] Basic unit tests implementation
- [ ] CI/CD pipeline setup
- [ ] Deployment configuration

## Development Setup

### Local Development (macOS)
1. Copy `backend/sample.env` to `.env` and configure your environment variables
2. Start your local MongoDB instance
3. Install dependencies and start services:
```bash
# Backend
cd backend
pnpm install
pnpm run dev

# Frontend (in another terminal)
cd frontend
pnpm install
pnpm run dev
```

### Docker Development
If you're using Docker (non-macOS), the same configuration works with Docker Compose:

1. Copy `backend/sample.env` to `.env` and configure your environment variables
2. Start the services:
```bash
docker-compose up
```

The Docker setup includes:
- Volume mounts for live code updates
- Network isolation between services
- Port mapping for local access
- Environment variable support from .env file

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
├── shared/                 # Shared types and utilities
├── docker/                # Docker configuration
└── scripts/               # Development scripts
