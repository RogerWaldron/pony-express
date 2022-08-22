require("dotenv").config();

const express = require("express");
const path = require("path");

const compress = require("compression");
const serveStatic = require("serve-static");
const logger = require("./lib/logger");

const usersRouter = require("./routes/users");
const { emailsRouter, emails } = require("./routes/emails");
const tokensRouter = require("./routes/tokens");

const basicAuth = require("./lib/basic-auth");
const tokenAuth = require("./lib/token-auth");
const findUser = require("./lib/find-user");

let app = express();

app.use(logger);
app.use(compress());
app.use(serveStatic(path.join(__dirname, "public")));
app.use("/uploads", serveStatic(path.join(__dirname, "uploads")));
app.use(
  "/uploads",
  serveStatic(path.join(__dirname, "uploads"), {
    setHeaders: setCustomMimetype,
  })
);
app.use("/tokens", tokensRouter);
app.use(tokenAuth(findUser.byToken));
app.use(basicAuth(findUser.byCredentials));
app.use("/users", usersRouter);
app.use("/emails", emailsRouter);

function setCustomMimetype(res, path) {
  let allUploads = emails.reduce((acc, item) => {
    return [...acc, ...item.attachments];
  }, []);
  let id = path.match("\buploads\b(w+)\b");
  let mimetype = allUploads.find(
    (item) => item.url.match("\buploads\b(w+)\b") === id
  ) || { type: "text/html" };
  res.set("Content-Type", mimetype.type);
}

app.listen(3000);
