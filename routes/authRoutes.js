import passport from "passport";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

export default (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/login`
          : "/login",
    }),
    (req, res) =>
      res.redirect(
        process.env.NODE_ENV === "development" ? `http://localhost:3000/` : "/",
      ),
  );

  app.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["user:email"] }),
  );

  app.get(
    "/auth/github/callback",
    passport.authenticate("github", {
      failureRedirect:
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000/login`
          : "/login",
    }),
    (req, res) =>
      res.redirect(
        process.env.NODE_ENV === "development" ? `http://localhost:3000/` : "/",
      ),
  );

  app.post("/auth/signup", async (req, res, next) => {
    try {
      const { email, name, password } = req.body;
      const existingUser = await User.findOne({ "local.email": email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashed = await bcrypt.hash(password, 12);
      const user = new User({
        local: { email, password: hashed },
        name,
        email,
      });
      await user.save();

      req.login(user, (err) => {
        if (err) return res.status(500).json({ error: err.message });

        const { local, ...userResponse } = user.toObject();
        res.json({
          user: userResponse,
          message: "Signup successful",
        });
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/auth/login", passport.authenticate("local"), (req, res) => {
    res.json({ user: req.user });
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout();
    req.session = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
