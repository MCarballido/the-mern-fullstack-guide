const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// middlewares will be parsed from top to bottom
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

// will have to start with the specified route
app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

// this only runs if we didn't send a response in one of our
// routes beforehand - therefore it is a request we don't handle
app.use(() => {
  throw new HttpError("Could not find this route.", 404);
});

// express expects 4 parameter middleware function like this
// this will only be executed on requests where errors were thrown
// it will be executed if any middleware in front of it yields an error
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred." });
});

mongoose // the query parameter /places? is the default name for the database we'll create
  .connect(
    "mongodb+srv://manu:manu123@cluster0-a483x.gcp.mongodb.net/places?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => app.listen(5000))
  .catch(err => console.error(err));
