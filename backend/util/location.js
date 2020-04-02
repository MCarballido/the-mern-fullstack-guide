const axios = require("axios");

const HttppError = require("../models/http-error");

const API_KEY = "AIzaSyAw3AGPVlSscEXQG-z4UqkT4R-XvVJMHNg";

const getCoordsForAddress = async address => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const { data } = response;

  if (!data || data.status === "ZERO_RESULTS") {
    throw new HttppError("Could not find location for the specified address", 404);
  }

  return data.results[0].geometry.location;
};

module.exports = getCoordsForAddress;
