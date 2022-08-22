const express = require("express");
const path = require("path");

const uuid = require("uuid");
let builder = require("xmlbuilder");
const bodyParser = require("body-parser");
const multer = require("multer");

const jsonToCsv = require("../convert-json.js");
const readBody = require("../lib/read-body.js");

const emails = require("../fixtures/emails");

const upload = multer({ dest: path.join(__dirname, "../uploads/") });

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
  let attachments = (req.files || []).map((f) => "/uploads/" + f.filename);
  let email = { ...req.body, id: uuid.v4(), attachments };
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

emailsRouter
  .route("/")
  .get(getEmailsRoute)
  .post(bodyParser.json(), upload.array("attachments"), createEmailRoute);

emailsRouter
  .route("/:id")
  .get(getEmailRoute)
  .patch(bodyParser, updateEmailRoute)
  .delete(deleteEmailRoute);

module.exports = emailsRouter;
