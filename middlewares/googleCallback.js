const googleCallback = async (req, res, next) => {
  console.log("HERE", {
    user: req.user,
    cookie: req.cookie,
    session: req.session,
  });

  next();
};

export default googleCallback;
