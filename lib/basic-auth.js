let basicAuth = (findUserByCredentials) => (req, res, next) => {
  let auth = req.headers.authorization;
  if (!auth) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  let [email, password] = Buffer.from(auth.split(" ")[1], "base64")
    .toString()
    .split(":");
  let user = findUserByCredentials(email, password);
  if (!user) {
    res.set("WWW-Authenticate", "Basic realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  req.user = user;
  next();
};

module.exports = basicAuth;
