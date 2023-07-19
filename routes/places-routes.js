const express = require("express");

const HttpError = require("../models/http-error");
const placesControllers = require("../controllers/places-controllers");

const router = express.Router();

router.get("/:placeId", placesControllers.getPlacesById);

router.get("/user/:userId", placesControllers.getPlacesByUserId);

module.exports = router;
