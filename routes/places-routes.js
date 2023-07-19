const express = require("express");

const router = express.Router();

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

router.get("/:placeId", (req, res, next) => {
  const placeId = req.params.placeId;
  const place = places.find((p) => {
    return p.id === placeId;
  });

  if (!place) {
    const error = new Error("Could not find a place");
    error.code = 404;
    return next(error);
  }

  console.log("get requests");
  res.json(place);
});

router.get("/user/:userId", (req, res, next) => {
  const userId = req.params.userId;

  const place = places.find((p) => {
    return p.creatorId === userId;
  });

  if (!place) {
    const error = new Error("Could not find a place with the given user_id");
    error.code = 404;
    return next(error);
  }

  console.log("get requests");
  res.json({ place });
});

module.exports = router;
