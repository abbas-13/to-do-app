import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import mongoose from "mongoose";

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  console.log("serialize user", user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  console.log("deserialise user", { user, id });
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ googleId: profile.id });
        console.log("google strategy", existingUser);

        if (existingUser) {
          return done(null, existingUser);
        }

        const user = await new User({
          googleId: profile.id,
          displayName: profile.displayName,
          name: profile.name.givenName,
          email: profile._json.email,
        }).save();
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    },
  ),
);
