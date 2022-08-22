const express = require("express");
const path = require("path");

const logger = require("./lib/logger");
const usersRouter = require("./routes/users");
const emailsRouter = require("./routes/emails");
const compress = require("compression");
const serveStatic = require("serve-static");

let app = express();

app.use(logger);
app.use(compress());
app.use("/users", usersRouter);
app.use("/emails", emailsRouter);
app.use(serveStatic(path.join(__dirname, "public")));

app.listen(3000);
