const express = require("express");
const uuid = require("uuid");
let builder = require("xmlbuilder");
const bodyParser = require("body-parser");

const jsonToCsv = require("../convert-json.js");
const readBody = require("../lib/read-body.js");

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
      res.send("Not Acceptable").sendStatus(406);
    },
  });
};

let getEmailRoute = (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  res.send(email);
};

const createEmailRoute = async (req, res) => {
  let email = { ...req.body, id: uuid.v4() };
  emails.push(email);
  res.status(201);
  res.send(email);
};

let updateEmailRoute = async (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  let index = emails.indexOf(email);
  emails[index] = { ...email, ...req.body };
  res.status(200);
  res.send(email);
};

let deleteEmailRoute = (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  let index = emails.indexOf(email);
  emails.splice(index, 1);
  res.sendStatus(204);
};

let emailsRouter = express.Router();

emailsRouter.route("/").get(getEmailsRoute).post(bodyParser, createEmailRoute);

emailsRouter
  .route("/:id")
  .get(getEmailRoute)
  .patch(bodyParser, updateEmailRoute)
  .delete(deleteEmailRoute);

module.exports = emailsRouter;
