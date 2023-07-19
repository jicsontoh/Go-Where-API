const HttpError = require("../models/http-error");
const uuid = require("uuid");

let places = [
  {
    id: "p1",
    title: "Marina Bay Sands",
    description:
      "Marina Bay Sands is a destination for those who appreciate luxury. An integrated resort notable for transforming Singapore’s city skyline, it comprises three 55-storey towers of extravagant hotel rooms and luxury suites with personal butler services.",
    img: "image",
    address: "10 Bayfront Avenue, Singapore 018956",
    coordinates: {
      lat: 1.2838,
      lng: 103.8591,
    },
    creatorId: "u1",
  },
];

const getPlacesById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = places.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new HttpError("Could not find a place", 404);
    return next(error);
  }

  res.json(place);
};

const getPlacesByUserId = (req, res, next) => {
  const userId = req.params.userId;

  const place = places.filter((p) => {
    return p.creatorId === userId;
  });

  if (!place || place.length === 0) {
    const error = new HttpError(
      "Could not find a places with the given user_id",
      404
    );
    return next(error);
  }

  res.json({ place });
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  places.push(createdPlace);
  res.status(201).json({ createdPlace });
};

const updatePlace = (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.pid;

  const updatedPlace = { ...places.find((p) => p === placeId) };
  const placeIdx = places.findIndex((p) => p.id === placeId);

  updatedPlace.title = title;
  updatedPlace.description = description;

  places[placeIdx] = updatedPlace;

  res.status(200).json({ updatedPlace });
};

const deletePlace = (req, res, next) => {
  const placeId = req.params.pid;
  places = places.filter((p) => p.id !== placeId);

  res.status(200).json({ message: "Successfully deleted place" });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
