import jwt from 'jsonwebtoken';
import { jwtConfig } from '@config/jwt.config';
import { IUserDocument } from '@models/User';

export class TokenService {
  generateAccessToken(user: IUserDocument): string {
    return jwt.sign(
      {
        sub: user._id,
        email: user.email,
      },
      jwtConfig.access.secret,
      {
        expiresIn: jwtConfig.access.expiresIn,
        issuer: jwtConfig.options.issuer,
        audience: jwtConfig.options.audience,
      }
    );
  }

  generateRefreshToken(user: IUserDocument): string {
    return jwt.sign(
      {
        sub: user._id,
      },
      jwtConfig.refresh.secret,
      {
        expiresIn: jwtConfig.refresh.expiresIn,
        issuer: jwtConfig.options.issuer,
        audience: jwtConfig.options.audience,
      }
    );
  }

  verifyToken(token: string, secret: string): any {
    return jwt.verify(token, secret);
  }

  generateAuthTokens(user: IUserDocument) {
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }
}
