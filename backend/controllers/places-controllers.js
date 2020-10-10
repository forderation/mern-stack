const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const mongoose = require("mongoose");
const User = require("../models/user");
const Place = require("../models/place");
const fs = require("fs");
const path = require("path");

const getPlaceById = async (req, res, next) => {
  placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Oops :( Something error when fetch to the place",
      500
    );
    return next(error);
  }

  if (!place) {
    // sync codes
    return next(new HttpError("Could not find place with given id.", 404));
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  userId = req.params.uid;
  let userWithPlaces;
  try {
    // return array of object
    userWithPlaces = await User.findById(userId, "-password").populate(
      "places"
    );
  } catch (err) {
    const error = new HttpError(
      `Oops :( Something error when fetch to the places`,
      500
    );
    return next(error);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    // sync codes
    return next(new HttpError("Could not find place with given id.", 404));
  }
  res.json({
    places: userWithPlaces.places.map((p) => p.toObject({ getters: true })),
  });
};

const createNewPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, address, location } = req.body;

  // GEOCODING API
  // let coordinates;
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  let user;
  const creator = req.userData.userId;
  try {
    user = await User.findById(creator);
  } catch (err) {
    const error = new HttpError("Something wrong with database!", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Cannot find user with provided id !", 404);
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    location: JSON.parse(location),
    address,
    image: req.file.path,
    creator,
  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      `Cannot create place, please try again ! ${err}`,
      500
    );
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updateExistingPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data", 422)
    );
  }
  const { title, description } = req.body;
  placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Couldn't update place, id doesn't exist", 500);
    return next(error);
  }

  // convert to string because by default creator is object that created by mongoose
  if (place.creator.toString() !== req.userData.userId) {
    console.log(
      `Auth Failed ${place.creator.toString()} != ${req.userData.userId}`
    );
    const error = new HttpError("You are not allowed to edit this place", 401);
    return next(error);
  }

  place.title = title;
  place.description = description;
  try {
    place = await place.save();
  } catch (err) {
    const error = new HttpError(
      "Couldn't update place somethings wrong with database",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deleteExistingPlace = async (req, res, next) => {
  placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId).populate("creator");
  } catch {
    const error = new HttpError("Something wrong when find place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Place with given id is not exist", 404);
    return next(error);
  }

  if (place.creator.id !== req.userData.userId) {
    console.log(
      `Auth Failed ${place.creator.toString()} != ${req.userData.userId}`
    );
    const error = new HttpError(
      "You are not allowed to delete this place",
      401
    );
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    const configSess = { session: sess };
    await place.remove(configSess);
    place.creator.places.pull(place);
    await place.creator.save(configSess);
    await sess.commitTransaction();
    fs.unlink(path.join(place.image), (err) => console.log(err));
  } catch {
    const error = new HttpError(
      "Couldn't delete place, something is wrong",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Delete place successfully" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createNewPlace,
  updateExistingPlace,
  deleteExistingPlace,
};
