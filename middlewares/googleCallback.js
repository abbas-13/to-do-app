const googleCallback = (req, res, next) => {
  const sessionId = req.sessionID;
  const cookie = req.session.cookie;
  const secret = process.env.COOKIE_KEY;

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(sessionId);
  const signature = hmac.digest("base64url");
  const signedCookie = `s:${signature}.${sessionId}`;

  const setCookie = `connect.sid=${signedCookie}; Path=/; Expires=${cookie.expires.toUTCString()}; HttpOnly; Secure; SameSite=None; Domain=.onrender.com`;
  res.setHeader("Set-Cookie", setCookie);
  console.log("MANUAL Set-Cookie:", setCookie);
  next();
};
export default googleCallback;
