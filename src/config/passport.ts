import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findUserByGoogleId, createUser } from '../repositories/user.repository';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value!;
        const avatar = profile.photos?.[0].value!;

        const existingUser = await findUserByGoogleId(profile.id);
        if (existingUser) return done(null, existingUser);

        const newUser = await createUser(
          profile.displayName,
          email,
          avatar,
          profile.id
        );

        return done(null, newUser);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;