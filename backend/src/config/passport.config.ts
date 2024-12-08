import passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { TokenService } from "@services/token.service";
import { UserService } from "@services/user.service";
import { jwtConfig } from "@config/jwt.config";
import { IUserDocument } from "@models/User";

const tokenService = new TokenService();
const userService = new UserService();

interface JwtPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
  iss: string;
  aud: string;
}

export const configurePassport = () => {
  // JWT Strategy
  passport.use(
    "jwt",
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtConfig.access.secret,
        issuer: jwtConfig.options.issuer,
        audience: jwtConfig.options.audience,
      },
      async (payload: JwtPayload, done) => {
        try {
          const user = await userService.findById(payload.sub);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  // Local Strategy
  passport.use(
    "local",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email: string, password: string, done) => {
        try {
          const user = await userService.verifyCredentials(email, password);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  return passport;
};

// Auth middleware
export const passportAuth = configurePassport();

// Helper to generate auth tokens
export const generateAuthTokens = (user: IUserDocument) => {
  return tokenService.generateAuthTokens(user);
};
