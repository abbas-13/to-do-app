import crypto from "crypto";

const googleCallback = (req, res, next) => {
  const sessionId = req.sessionID; // H9zoUIFKId7_Qupd2-2TAG6-Kcp3e1Fr
  const cookie = req.session.cookie;
  const secret = process.env.SESSION_SECRET;

  // Create EXACT signed format express-session uses: s:<sig>.<id>
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(sessionId);
  const signature = hmac.digest("base64url");
  const signedCookie = `s:${signature}.${sessionId}`;

  // Match your session cookie settings from logs
  const setCookie = [
    `connect.sid=${signedCookie}`,
    `Path=${cookie.path || "/"}`,
    `Expires=${cookie.expires.toUTCString()}`,
    "HttpOnly",
    "Secure",
    "SameSite=None",
    `Domain=${cookie.domain}`, // .onrender.com
  ]
    .filter(Boolean)
    .join("; ");

  res.setHeader("Set-Cookie", setCookie);
  console.log("Manual Set-Cookie sent:", setCookie);
  next();
};
