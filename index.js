const express = require("express");
const path = require("path");

const logger = require("./lib/logger");
const usersRouter = require("./routes/users");
const { emailsRouter, emails } = require("./routes/emails");
const compress = require("compression");
const serveStatic = require("serve-static");

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
