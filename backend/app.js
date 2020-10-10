const express = require("express");
const app = express();
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-error");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

app.use(bodyParser.json());
app.use("/upload/images/", express.static(path.join("upload", "images")));

// using include react app on public folder
<<<<<<< HEAD
app.use(express.static(path.join("public")));
=======
// app.use(express.static(path.join("public")));
>>>>>>> development

app.use((req, res, next) => {
  // Allowing CORS if has different port and domain server
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// if no one routes are correct redirect on react index apps
app.use((req, res, next) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

// use this if our node on REST api mode
app.use((err, req, res) => {
  const error = new HttpError("Couldn't find this route", 404);
  throw error;
});

app.use((err, req, res, next) => {
  // unlink upload images where fails to validate
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  // if header os response has error
  if (res.headerSent) {
    return next(err);
  }
  res.status(err.code || 500);
  res.json({ message: err.message || "An unknown error occured" });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kwer4.gcp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
  )
  .then(() => app.listen(process.env.PORT || 5000))
  .catch((err) => console.log(err));
