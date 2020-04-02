const express = require("express");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

// middlewares will be parsed from top to bottom
app.use(bodyParser.json());

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

app.listen(5000);
