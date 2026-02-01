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
    passport.authenticate("google", {
      failureRedirect: "/login",
      session: true,
    }),
    (req, res) => {
      googleCallback();
      console.log("Session ID:", req.sessionID);
      console.log("Full session cookie:", JSON.stringify(req.session.cookie));
      console.log("Set-Cookie headers:", res.getHeaders()["set-cookie"]);

      console.log("req.user exists:", !!req.user);
      console.log("req.session content:", req.session);

      res.json({
        success: true,
        redirect: process.env.CLIENT_SIDE_URL,
      });
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
