const express = require("express");
const app = express();
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use((err, req, res) => {
  const error = new HttpError("Couldn't find this route", 404);
  throw error;
});
app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://forderation:PY6qcP4vxByBcRkZ@cluster0.kwer4.gcp.mongodb.net/map_places?retryWrites=true&w=majority"
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
