const express = require("express");

const logger = require("./lib/logger");
const usersRouter = require("./routes/users");
const emailsRouter = require("./routes/emails");
const compress = require("compression");

let app = express();

app.use(logger);
app.use(compress())
app.use("/users", usersRouter);
app.use("/emails", emailsRouter);

app.listen(3000);
