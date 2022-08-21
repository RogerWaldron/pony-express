const express = require("express");
let builder = require("xmlbuilder");

const jsonToCsv = require("../convert-json.js");
const emails = require("../fixtures/emails");

let getEmailsRoute = (req, res) => {
  res.format({
    "text/csv": () => {
      res.send(jsonToCsv(emails));
    },
    "application/xml": () => {
      let xml = builder.create("emails");
      emails.map((item) => xml.ele({ email: item }));
      res.send(xml.end({ pretty: true }));
    },
    "application/json": () => {
      res.send(emails);
    },
    default: () => {
      res.status(406).send("Not Acceptable");
    },
  });
};

let getEmailRoute = (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  res.send(email);
};

let emailsRouter = express.Router();
emailsRouter.get("/", getEmailsRoute);
emailsRouter.get("/:id", getEmailRoute);

module.exports = emailsRouter;
