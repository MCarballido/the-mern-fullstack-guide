const uuid = require("uuid/v4");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Mnau Carba",
    email: "test@test.com",
    password: "testers"
  }
];

const getUsers = (req, res) => {
  // status 200 doesn't need to be specified
  res.json({ users: DUMMY_USERS });
};

const signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid data. Please check the inputs.", 422);
  }

  const { name, email, password } = req.body;

  if (DUMMY_USERS.find(user => user.email === email)) {
    throw new HttpError("Email already exists.", 422);
  }

  const createdUser = { id: uuid(), name, email, password };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res) => {
  // temporary logic
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);

  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError("User email or password are not valid.", 401);
  }

  res.json({ message: "Logged in successfully." });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
