

import dotenv from 'dotenv';
import path from 'path';

// Load the appropriate .env file
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env' 
  : '.env.development';

dotenv.config({ 
  path: path.join(__dirname, '..', '..', envFile) 
});

export const config = {
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/surge-social',
    dbName: process.env.DB_NAME || 'surge-social-dev',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret',
    expiresIn: process.env.JWT_EXPIRATION || '1h',
  },
};

// Validation function
export const validateConfig = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET'];
  
  const missingVars = requiredVars.filter(
    (item) => !process.env[item]
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};
