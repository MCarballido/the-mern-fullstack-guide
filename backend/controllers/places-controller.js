const fs = require("fs");

const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require("../models/http-error");
const getCoordsFromAddress = require("../util/location");
const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    place = await Place.findById(placeId); // if you want to receive a promise you can also call .exec()
  } catch (err) {
    return next(new HttpError("Something went wrong, could not find any place.", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place for the provided ID.", 404)); // one option
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const uid = req.params.uid;

  let places;
  try {
    places = await Place.find({ creator: uid });
  } catch (err) {
    return next(new HttpError("Something went wrong, could not find any place.", 500));
  }

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find places for the provided user ID.", 404)); // better for asynchronous calls, rather than throws
  }

  res.json({ places: places.map(place => place.toObject({ getters: true })) });
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

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    return next(new HttpError("Creating place failed, please try again later.", 500));
  }

  if (!user) {
    return next(new HttpError("Could not find user for the provided ID.", 404));
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await createdPlace.save({ session });
    user.places.push(createdPlace); // mongoose method that establishes the connection
    await user.save({ session });

    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Creating place failed, please try again.", 500));
  }

  res.status(201).json({ place: createdPlace.toObject({ getters: true }) });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid data. Please check the inputs.", 422));
  }

  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId); // if you want to receive a promise you can also call .exec()
  } catch (err) {
    return next(new HttpError("Something went wrong, could not find any place.", 500));
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    return next(new HttpError("Something went wrong, could not update the place.", 500));
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;
  try {
    // with .populate you get access to the entire content of a document stored in another collection
    place = await Place.findById(placeId).populate("creator");
  } catch (err) {
    return next(new HttpError("Something went wrong, could not delete the place.", 500));
  }

  if (!place) {
    return next(new HttpError("Could not find a place for the provided ID.", 404));
  }

  const imagePath = place.image;

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await place.remove({ session });
    place.creator.places.pull(place);
    await place.creator.save({ session });

    await session.commitTransaction();
  } catch (err) {
    return next(new HttpError("Something went wrong, could not delete the place.", 500));
  }

  fs.unlink(imagePath, err => err && console.error(err));

  res.status(200).json({ message: "Place successfully deleted." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
