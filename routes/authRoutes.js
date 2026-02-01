import passport from "passport";
import googleCallback from "../middlewares/googleCallback.js";

export default (app) => {
  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
    }),
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google"),
    (req, res) => {
      res.redirect("/");
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
