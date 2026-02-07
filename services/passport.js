import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

import mongoose from "mongoose";

const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
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

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ githubId: profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }
        const user = new User({
          githubId: profile.id,
          name: profile.displayName,
          username: profile.username,
        });
        await user.save();
      } catch (error) {
        done(error, null);
      }
    },
  ),
);

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      const user = await User.findOne({ "local.email": email });
      if (!user || !user.local.password) return done(null, false);
      const valid = await bcrypt.compare(password, user.local.password);
      valid ? done(null, user) : done(null, false);
    },
  ),
);
