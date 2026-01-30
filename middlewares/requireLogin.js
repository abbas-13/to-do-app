const requireLogin = (req, res, next) => {
  console.log("=== SESSION DEBUG ===", {
    user: req.user,
    sessionID: req.sessionID,
    hasSession: !!req.session,
    sessionData: req.session,
    cookies: req.headers.cookie,
  });
  if (!req.user) {
    return res.status(401).send({ error: "You need to login first" });
  }
  next();
};

export default requireLogin;
