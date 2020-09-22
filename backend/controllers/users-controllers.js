const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");

let USERS = [
  {
    id: "u2",
    name: "Kharisma Muzaki",
    email: "123@gmail.com",
    password: "tester",
  },
  {
    id: "u1",
    name: "Max Schwarz",
    email: "12356@gmail.com",
    password: "tester",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: USERS });
};

const userSignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { name, password, email } = req.body;
  const hasUser = USERS.find((u) => u.email === email);
  if (hasUser) {
    throw new HttpError("Email has already taken.", 422);
  }
  const user = { id: uuidv4(), name, email, password };
  USERS.push(user);
  res.status(201).json({ user });
};

const userSignIn = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("Email or password is wrong", 401);
  }
  res.status(200).json({ message: "Logged in" });
};

module.exports = { getUsers, userSignUp, userSignIn };
