const express = require("express");
let builder = require("xmlbuilder");

const jsonToCsv = require("../convert-json.js");
const users = require("../fixtures/users");

let getUsersRoute = (req, res) => {
  res.format({
    "text/csv": () => {
      res.send(jsonToCsv(users));
    },
    "application/xml": () => {
      let xml = builder.create("users");
      users.map((item) => xml.ele({ user: item }));
      res.send(xml.end({ pretty: true }));
    },
    "application/json": () => {
      res.send(users);
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  });
};

let getUserRoute = (req, res) => {
  let user = users.find((item) => item.id === req.params.id);
  res.send(user);
};

const usersRouter = express.Router();
usersRouter.get("/", getUsersRoute);
usersRouter.get("/:id", getUserRoute);

module.exports = usersRouter;
