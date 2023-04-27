const express = require("express");
const { UserModel } = require("../models/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();
const KEY = process.env.KEY;

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.find({ email });

    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, KEY);
          res.send({ msg: "Login Successful", token: token });
        } else {
          res.send({ msg: "Invalid Email or Password" });
        }
      });
    } else {
      res.send({ msg: "User Not Found" });
    }
  } catch (error) {
    console.log("Error while loggin in User", error);
    res.send("Error while loggin in User");
  }
});

userRouter.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    bcrypt.hash(password, 5, async (err, secure_pass) => {
      if (err) {
        console.log("Error while hashing the password", err);
      } else {
        const user = new UserModel({ email, password: secure_pass });
        await user.save();
        res.send({ msg: "User Registered", status: 200 });
      }
    });
  } catch (error) {
    console.log("Error while Registering new User", error);
    res.send({ msg: "Error while Registering new User", status: 500 });
  }
});

module.exports = {
  userRouter,
};
