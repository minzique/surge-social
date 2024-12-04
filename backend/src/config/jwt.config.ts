export const jwtConfig = {
  access: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
    expiresIn: '1h'
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_here',
    expiresIn: '7d'
  },
  options: {
    issuer: 'surge-social',
    audience: 'surge-social-client'
  }
};
