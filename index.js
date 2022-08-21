const express = require("express");
const convert = require("./convert-json.js");
let builder = require("xmlbuilder");

const users = require("./fixtures/users");
const emails = require("./fixtures/emails");
const { jsonToCsv } = require("./convert-json.js");

let app = express();

app.use((req, res) => {
  let route = req.method + " " + req.url;
  const prefResp = req.accepts([
    "application/json",
    "application/xml",
    "text/csv",
  ]);
  res.type(prefResp || "json");

  if (route === "GET /users") {
    switch (prefResp) {
      case "text/csv":
        res.send(convert.jsonToCsv(users));
        break;
      case "application/xml":
        let xml = builder.create("users");
        users.map((item) => xml.ele({ user: item }));
        res.send(xml.end({ pretty: true }));
        break;
      case "application/json":
      default:
        res.send(users);
        break;
    }
  } else if (route === "GET /emails") {
    switch (prefResp) {
      case "text/csv":
        res.send(convert.jsonToCsv(emails));
        break;
      case "application/xml":
        let xml = builder.create("emails");
        emails.map((item) => xml.ele({ email: item }));
        res.send(xml.end({ pretty: true }));
        break;
      case "application/json":
      default:
        res.send(emails);
        break;
    }
  } else {
    res.end("You asked for " + route);
  }
});

app.listen(3000);
