const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = process.env.JWT_KEY;

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Error when fetch user. please try again", 500);
    return err;
  }
  if (users.length === 0) {
    const err = new HttpError("Users collection is empty", 500);
    return err;
  }
  res
    .status(200)
    .json({ users: users.map((u) => u.toObject({ getters: true })) });
};

const userSignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError(
      "Invalid inputs passed, please check your data",
      422
    );
    return next(error);
  }
  const { name, password, email } = req.body;

  let exisingUser;

  try {
    exisingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Something wrong when fetch user", 500);
    return next(err);
  }

  if (exisingUser) {
    const error = new HttpError("Email has already taken", 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again later!",
      500
    );
    return next(error);
  }

  let newUser;
  try {
    newUser = await new User({
      name,
      password: hashedPassword,
      email,
      image: req.file.path,
      places: [],
    }).save();
  } catch (error) {
    const err = new HttpError(`Something wrong when create user`, 500);
    return next(err);
  }

  let token;
  try {
    token = jwt.sign({ userId: newUser.id, email: newUser.email }, PRIVATE_KEY, {
      expiresIn: "2h",
    });
  } catch (err) {
    const error = new HttpError(
      `Something wrong cannot signup, please try again`,
      500
    );
    return next(error);
  }

  res.status(201).json({ userId: newUser.id, email: newUser.email, token });
};

const userSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  let exisingUser;

  try {
    exisingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Something wrong when fetch user", 500);
    return next(err);
  }

  if (!exisingUser) {
    const error = new HttpError(
      "Invalid credentials, Account did not found!",
      401
    );
    return next(error);
  }

  let isValidPassword = false;

  try {
    isValidPassword = await bcrypt.compare(password, exisingUser.password);
  } catch (err) {
    const error = new HttpError(
      "Could not login, something wrong. Please try again !",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, Password is wrong!", 401);
    return next(error);
  }

  let token;
  try {
    token = jwt.sign({ userId: exisingUser.id, email: exisingUser.email }, PRIVATE_KEY, {
      expiresIn: "2h",
    });
  } catch (err) {
    const error = new HttpError(
      `Something wrong cannot logged in, please try again`,
      500
    );
    return next(error);
  }

  res.status(200).json({ userId: exisingUser.id, email: exisingUser.email, token });
};

module.exports = { getUsers, userSignUp, userSignIn };
