const HttpError = require("../models/http-error");
const uuid = require("uuid");
const { validationResult } = require("express-validator");
const Place = require("../models/place");
const User = require("../models/user");
const mongoose = require("mongoose");

const getPlacesById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Could not find a place", 404);
    return next(error);
  }

  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let place;

  try {
    place = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find places",
      500
    );
    return next(error);
  }

  if (!place || place.length === 0) {
    const error = new HttpError(
      "Could not find a places with the given user id",
      404
    );
    return next(error);
  }

  res.json({ places: place.places.map((p) => p.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs", 422);
    return next(error);
  }

  const { title, description, coordinates, address, creatorId } = req.body;

  const createdPlace = new Place({
    title,
    description,
    address,
    coordinates,
    image:
      "https://en.wikipedia.org/wiki/File:Marina_Bay_Sands_in_the_evening_-_20101120.jpg",
    creatorId,
  });

  let user;

  try {
    user = await User.findById(creatorId);
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Creating place failed, no such user", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdPlace.save({ session: sess });
    user.places.push(createdPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError("Creating place failed", 500);
    return next(error);
  }

  res.status(201).json({ createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs", 422);
    return next(error);
  }

  const { title, description } = req.body;
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not save place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId).populate("creatorId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  if (!place) {
    const error = new HttpError("No such place", 404);
    return next(error);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.deleteOne();
    place.creatorId.places.pull(place);
    await place.creatorId.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not remove place",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Successfully deleted place" });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
