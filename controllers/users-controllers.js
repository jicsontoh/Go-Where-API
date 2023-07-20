const uuid = require("uuid");
const HttpError = require("../models/http-error");

const users = [
  {
    id: "u1",
    name: "John",
    email: "john@gmail.com",
    password: "test",
  },
];

const getUsers = (req, res, next) => {
  res.json({ users: users });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

  const hasUser = users.find((u) => u.email === email);

  if (hasUser) {
    throw new HttpError("User already exists", 422);
  }

  const createdUser = {
    id: uuid.v4(),
    name,
    email,
    password,
  };
  users.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = users.find((u) => u.email === email);
  if (!foundUser || foundUser.password !== password) {
    throw new HttpError("Incorrect email or password");
  }

  res.json({ message: "Login successfull!" });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
