const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const getCoordsForAddress = require("../utils/location");
const Place = require("../models/place");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire State Building",
    description: "One of the most famous sky scrapers in the world!",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
    address: "20 W 34th St, New York, NY 10001",
    location: {
      lat: 40.7484405,
      lng: -73.9878584,
    },
    creator: "u1",
  },
];

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

const updateExistingPlace = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { title, description } = req.body;
  placeId = req.params.pid;
  const place = { ...DUMMY_PLACES.find((p) => p.id === placeId) };
  console.log(`PLACES PATCH ${place}`);
  if (!place.id) {
    // sync codes
    throw new HttpError("Could not find place with given id.", 404);
  }
  const placeIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);
  place.title = title;
  place.description = description;
  DUMMY_PLACES[placeIndex] = place;
  res.status(200).json({ place });
};

const deleteExistingPlace = (req, res, next) => {
  placeId = req.params.pid;
  DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id !== placeId);
  res.status(200).json({ message: "Delete place successfully" });
};

module.exports = {
  getPlaceById,
  getPlacesByUserId,
  createNewPlace,
  updateExistingPlace,
  deleteExistingPlace,
};
