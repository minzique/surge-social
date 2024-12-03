# Surge Social

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

### Environment Variables
All environment variables are managed in a single `.env` file:
- `PORT`: Backend server port (default: 5000)
- `FRONTEND_PORT`: Frontend development server port (default: 3000)
- `BACKEND_PORT`: Backend container exposed port (default: 5000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation

### TypeScript Configuration
The backend uses a strict TypeScript configuration with enhanced features:

#### Path Aliases
Import paths are aliased for cleaner code:
```typescript
// Instead of relative paths:
import { UserModel } from '../../../models/User'

// Use aliases:
import { UserModel } from '@models/User'
```

Available aliases:
- `@/*` - src directory
- `@controllers/*` - controllers
- `@models/*` - models
- `@middleware/*` - middleware
- `@routes/*` - routes
- `@types/*` - types
- `@dtos/*` - DTOs

#### Type Checking
Strict type checking is enabled with:
- No implicit any (`noImplicitAny`)
- Strict null checks (`strictNullChecks`)
- No unused locals/parameters
- No implicit returns
- No unreachable code
- Strict function types
- Strict property initialization

#### Development Features
- Source maps for debugging
- Declaration files generation
- Decorator metadata emission
- JSON module resolution
- JavaScript checking

### Architecture
- Frontend: React with TypeScript
- Backend: Express with TypeScript
- Database: MongoDB
- Authentication: JWT-based with Passport
