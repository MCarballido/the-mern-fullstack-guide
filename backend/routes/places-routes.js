const express = require("express");

const HttpError = require("../models/http-error");

const router = express.Router();

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "Lorem ipsum dolor",
    location: {
      lat: 40.7484474,
      lng: -73.9871516
    },
    address: "20 W 34th St, New York, NY 10001",
    creatorId: "u1"
  }
];

router.get("/:pid", (req, res) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find(p => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided ID.", 404); // one option
  }

  res.json({ place });
});

router.get("/user/:uid", (req, res, next) => {
  const uid = req.params.uid;
  const place = DUMMY_PLACES.find(p => p.creatorId === uid);

  if (!place) {
    return next(new HttpError("Could not find a place for the provided user ID.", 404)); // better for asynchronous calls
  }

  res.json({ place });
});

module.exports = router;
