require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const findUser = require("../lib/find-user");

const signature = process.env.SIGNATURE || "secret";

const createToken = (user) => {
  jwt.sign({ userId: user.id }, signature, { expiresIn: process.env.EXPIREIN });
};

const createTokenRoute = async (req, res) => {
  let cred = req.body;
  let user = await findUser.byCredentials(cred);
  if (!user) {
    console.log("User not found");
    res.sendStatus(422);
  } else {
    let token = createToken(user);
    console.log("Token created: ", token);
    res.status(201);
    res.send(token);
  }
};

const tokensRouter = express.Router();
tokensRouter.post("/", bodyParser.json(), createTokenRoute);

module.exports = tokensRouter;
