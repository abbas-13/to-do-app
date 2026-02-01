import passport from "passport";
import crypto from "crypto";

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
      session: false,
    }),
    (req, res) => {
      if (!req.user) {
        return res.redirect("/login?error=auth_failed");
      }

      const sessionId = crypto.randomBytes(32).toString("hex");
      const secret = process.env.COOKIE_KEY;

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(sessionId);
      const signature = hmac.digest("base64url");
      const signedCookie = `s:${signature}.${sessionId}`;

      const setCookie = `connect.sid=${signedCookie}; Path=/; Max-Age=86400; HttpOnly; Secure; SameSite=None; Domain=.onrender.com`;

      res.setHeader("Set-Cookie", setCookie);
      console.log("MANUAL session cookie created:", setCookie);

      res.json({
        success: true,
        redirect: process.env.CLIENT_SIDE_URL + "/dashboard",
        user: req.user.id,
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
