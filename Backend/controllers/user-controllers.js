// import User from "../models/User";
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const controllers = {};
controllers.getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "No users found" });
  }
  console.log("allUsers:", users);
  return res.status(200).json({ users });
};
controllers.signUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log("ERROR:", err);
  }
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "User is already exits! Login Instead" });
  }
  const hashedPassword = bcrypt.hashSync(password);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
  } catch (err) {
    console.log("ERROR:", err);
  }
  console.log("User created");
  return res.status(201).json({ user });
};
controllers.login = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log("ERROR:", err);
  }
  if (!existingUser) {
    return res
      .status(404)
      .json({ message: "Could not find user by this email" });
  }
  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }
  console.log("Login Successfull");
  return res.status(200).json({ message: "Login Successfull" });
};

module.exports = controllers;
