const express = require("express");
const path = require("path");

const uuid = require("uuid");
let builder = require("xmlbuilder");
const bodyParser = require("body-parser");
const multer = require("multer");

const jsonToCsv = require("../convert-json.js");
const readBody = require("../lib/read-body.js");
const enforce = require("../lib/enforce.js");
const requireAuth = require("../lib/require-auth.js");

const emails = require("../fixtures/emails");

const upload = multer({ dest: path.join(__dirname, "../uploads/") });

let getEmailsRoute = (req, res) => {
  if (emails.length === 0 ? (emails = []) : emails);
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
  if (!email) {
    res.statusSend(501);
  }
  res.send(email);
};

const createEmailRoute = async (req, res) => {
  let attachments = (req.files || []).map((f) => {
    return { url: "/uploads/" + f.filename, type: file.mimetype };
  });
  let email = { ...req.body, id: uuid.v4(), attachments };
  emails.push(email);
  res.status(201);
  res.send(email);
};

let updateEmailRoute = async (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  let newAttachments = req.files.map((f) => {
    return { url: "/uploads/" + f.filename, type: file.mimetype };
  });
  req.authorize(email);
  let index = emails.indexOf(email);
  req.body.attachments = [...email.attachments, ...newAttachments];
  emails[index] = { ...email, ...req.body };
  res.status(200);
  res.send(email);
};

let deleteEmailRoute = (req, res) => {
  let email = emails.find((item) => item.id === req.params.id);
  req.authorize(email);
  let index = emails.indexOf(email);
  emails.splice(index, 1);
  res.sendStatus(204);
};

const updateEmailPolicy = (user, email) => user.id === email.from;
const deleteEmailPolicy = (user, email) => user.id === email.to;

let emailsRouter = express.Router();

emailsRouter.use(requireAuth);

emailsRouter
  .route("/")
  .get(getEmailsRoute)
  .post(
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    upload.array("attachments"),
    createEmailRoute
  );

emailsRouter
  .route("/:id")
  .get(getEmailRoute)
  .patch(
    enforce(updateEmailPolicy),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    upload.array("attachments"),
    updateEmailRoute
  )
  .delete(enforce(deleteEmailPolicy), deleteEmailRoute);

module.exports = {
  emails,
  emailsRouter,
};
