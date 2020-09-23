const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

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
  const { name, password, email, image } = req.body;

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

  let newUser;
  try {
    newUser = await new User({ name, password, email, image, places: [] }).save();
  } catch (error) {
    const err = new HttpError("Something wrong when create user", 500);
    return next(err);
  }

  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};

const userSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  let exisingUser;

  try {
    exisingUser = await User.findOne({ email: email, password: password });
  } catch (error) {
    const err = new HttpError("Something wrong when fetch user", 500);
    return next(err);
  }

  if (!exisingUser) {
    const error = new HttpError(
      "Logging in failed !, Email or password is wrong!",
      422
    );
    return next(error);
  }

  res.status(200).json({ user: exisingUser.toObject({ getters: true }) });
};

module.exports = { getUsers, userSignUp, userSignIn };
