import passport from "passport";
import googleCallback from "../middlewares/googleCallback.js";

export default (app) => {
  app.get(
    "/auth/google",
    googleCallback,
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: true,
    }),
    (req, res) => {
      console.log(req);
      res.redirect(process.env.CLIENT_SIDE_URL);
    },
  );

  app.post("/api/logout", (req, res, next) => {
    req.logout();
    req.session = null;
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/current_user", (req, res) => {
    res.send(req.user);
  });
};
