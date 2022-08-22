require("dotenv").config();

const jwt = require("jsonwebtoken");

const signature = process.env.SIGNATURE || "secret";

let tokenAuth = (findUserByToken) => (req, res, next) => {
  let auth = req.headers.authorization;
  if (!auth) {
    res.set("WWW-Authenticate", "Bearer realm=Authorization Required");
    res.sendStatus(401);
    return;
  }
  let type,
    token = auth.split(" ");

  if (type === "Bearer") {
    let payload = jwt.verify(token, signature);

    if (!payload) {
      res.sendStatus(401);
      return;
    }

    let user = findUserByToken(payload);

    if (!user) {
      res.set("WWW-Authenticate", "Bearer realm=Authorization Required");
      res.sendStatus(401);
      return;
    }
    req.user = user;
  }

  next();
};

module.exports = tokenAuth;
