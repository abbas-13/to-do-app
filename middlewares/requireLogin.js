const requireLogin = (req, res, next) => {
  console.log("require login", req.user);
  if (!req.user) {
    return res.status(401).send({ error: "You need to login first" });
  }
  next();
};

export default requireLogin;
