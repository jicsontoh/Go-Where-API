const HttpError = require("../models/http-error");

const places = [
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

  const place = places.find((p) => {
    return p.creatorId === userId;
  });

  if (!place) {
    const error = new HttpError(
      "Could not find a place with the given user_id",
      404
    );
    return next(error);
  }

  res.json({ place });
};

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
