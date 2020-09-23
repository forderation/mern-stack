const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

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
  let places;
  try {
    // return array of object
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      "Oops :( Something error when fetch to the places",
      500
    );
    return next(error);
  }

  if (places.length === 0) {
    // sync codes
    return next(new HttpError("Could not find place with given id.", 404));
  }
  res.json({ places: places.map((p) => p.toObject({ getters: true })) });
};

const createNewPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    next(new HttpError("Invalid inputs passed, please check your data", 422));
  }

  const { title, description, coordinates, address, creator, image } = req.body;

  // GEOCODING API
  // let coordinates;
  // try {
  //   coordinates = await getCoordsForAddress(address);
  // } catch (error) {
  //   return next(error);
  // }

  const createdPlace = new Place({
    title,
    description,
    location: coordinates,
    address,
    image,
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Cannot create place, please try again !", 500);
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
    place = await Place.findById(placeId);
  } catch {
    const error = new HttpError(
      "Couldn't delete place, given id is not exist",
      500
    );
    return next(error);
  }

  try {
    await place.delete();
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
