const googleCallback = async (req, res) => {
  const user = req.session.passport.user;

  const encodedTk = jwToken.encodeToken(user);

  res.cookie("tk", encodedTk, {
    maxAge: 24 * 60 * 60 * 1000,
  });

  res.redirect(process.env.CLIENT_SIDE_URL);
};

export default googleCallback;
