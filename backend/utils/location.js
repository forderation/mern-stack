const HttpError = require("../models/http-error");

const API_KEY = "AIzaSyCYdy06gEh15qVaEgjREle78GBCxq2BJ-s";
const axios = require("axios");
async function getCoordsForAddress(address) {
  const response = axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );
  const data = response.data;
  console.log(data);
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find coordinates for the specified address.",
      422
    );
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}

module.exports = getCoordsForAddress;