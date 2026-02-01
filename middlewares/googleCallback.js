import crypto from "crypto";

const googleCallback = (req, res, next) => {
  // SAFE CHECK - your earlier logs showed it exists post-Passport
  if (!req.session || !req.sessionID) {
    console.log("No session available, skipping manual cookie");
    return next();
  }

  const sessionId = req.sessionID;
  const cookie = req.session.cookie;
  const secret = process.env.SESSION_SECRET;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(sessionId);
  const signature = hmac.digest("base64url");
  const signedCookie = `s:${signature}.${sessionId}`;

  const setCookie = `connect.sid=${signedCookie}; Path=/; Expires=${cookie.expires.toUTCString()}; HttpOnly; Secure; SameSite=None; Domain=.onrender.com`;
  res.setHeader("Set-Cookie", setCookie);
  console.log("Manual Set-Cookie sent:", setCookie);
  next();
};

export default googleCallback;
