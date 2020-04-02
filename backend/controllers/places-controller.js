const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const getCoordsFromAddress = require("../util/location");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Lorem ipsum dolor",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1"
  }
];

const getPlaceById = (req, res) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided ID.", 404); // one option
  }

  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const uid = req.params.uid;
  const places = DUMMY_PLACES.filter(p => p.creator === uid);

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find places for the provided user ID.", 404)); // better for asynchronous calls
  }

  res.json({ places });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // we replace throw with next() because throw does not work correcty in asynchronous code in Express
    return next(new HttpError("Invalid data. Please check the inputs.", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsFromAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = { id: uuid(), title, description, location: coordinates, address, creator };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid data. Please check the inputs.", 422);
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
  const newUpdatedPlace = { ...DUMMY_PLACES[placeIndex] };

  // transaction emulated... we create a new object and modify it
  // if no error is thrown we override the old one, instead of updating
  // it and remain with unconsistent data in case an error occurs
  newUpdatedPlace.title = title;
  newUpdatedPlace.description = description;

  DUMMY_PLACES[placeIndex] = newUpdatedPlace;

  res.status(200).json({ place: newUpdatedPlace });
};

const deletePlace = (req, res) => {
  const placeId = req.params.pid;

  if (!DUMMY_PLACES.find(p => p.id === placeId)) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

  res.status(200).json({ message: "Place successfully deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
