// const express = require("express")
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const dbUri = process.env.MONGODB_URI;

const generate = (id) => {
  const secretKey = "appointmed";

  const token = jwt.sign({ userId: id }, secretKey, { expiresIn: "1h" });
  // res.json({ token });
  return token;
};

const validate = async (email, password, UserModel) => {
  var t1 = [];

  const db = await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // console.log(db);
  // const collection = await db.collection("users");
  await UserModel.findOne({ userEmail: email }).then((users) => {
    console.log(users);

    t1 = users;
  });

  // console.log(t1);
  if (t1.length === 0) {
    return { message: "no user found", status: false };
  } else {
    if (t1.userPassword === password) {
      return {
        message: generate(t1._id),
        status: true,
      };
    } else {
      return { message: "wrong credentials", status: false };
    }
  }
};

const insert = async (email, password, UserModel) => {
  console.log("email ,passswod in inser", email, password);
  const db = await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var createdUser;
  var existingUsers = {};
  // const collection = db.collection("users");
  await UserModel.find({ userEmail: email }).then((user) => {
    existingUsers = user;
  });

  if (existingUsers.length !== 0) {
    return { message: "user already existing", status: false };
  } else {
    // await UserModel.create({
    //   userEmail: email,
    //   userPassword: password,
    const newUser = new UserModel({
      userEmail: email,
      userPassword: password,
    });
    await newUser
      .save()
      .then((user) => {
        console.log("in then ", user);
        createdUser = user;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return {
    message: generate(createdUser._id),
    status: true,
  };

  // console.log(users);
};

const tokenValidity = (token) => {
  const secretKey = "appointmed";
  var variable;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.error("Invalid token:", err);
      variable = false;
      // return false;
    } else {
      console.log("Token is valid:", decoded);
      variable = true;
    }
  });
  return variable;
};

module.exports = { validate, insert, tokenValidity };
