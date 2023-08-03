const express = require("express");
const authenticationRoutes = express.Router();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const jwt_decode = require("jwt-decode");
require("dotenv").config();
const User = require("../models/user.model");
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client("707797281139-4aqd3htq7bnut6nsp76ufc448svl64r9.apps.googleusercontent.com");

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "707797281139-4aqd3htq7bnut6nsp76ufc448svl64r9.apps.googleusercontent.com",
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}

authenticationRoutes.route("/login").post(async (req, res) => {
  try {
    console.log("Inside the login");
    if (req.body.credential) {

      const verificationResponse = await verifyGoogleToken(req.body.credential);
      if (verificationResponse.error) {
        return res.status(400).json({ message: "Login failed", status: false });
      }
      const profile = verificationResponse?.payload;

      const userDocument = await User.findOne({ emailAddress: profile?.email });
      if (userDocument) {
        if (userDocument.isProfileComplete === true) {
          return res.status(200).json({
            message: "Success",
            user: {
              picture: profile?.picture,
              token: jwt.sign({ userData: userDocument }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXP, }),
            },
            availability: true,
            isProfileComplete: true,
            status: true,
          });
        } else {
          res.status(200).json({
            message: "New User",
            user: {
              firstName: profile?.given_name,
              lastName: profile?.family_name,
            },
            availability: true,
            isProfileComplete: false,
            status: true,
          });
        }
      } else {
        if (profile?.email === "ragurajsivanantham@gmail.com") {
          res.status(200).json({
            message: "New User",
            user: {
              firstName: profile?.given_name,
              lastName: profile?.family_name,
            },
            availability: true,
            isProfileComplete: false,
            status: true,
          });
        } else {
          res.status(200).json({
            message: "You have no access to the system. Please contact the administrator.",
            user: {
              firstName: profile?.given_name,
              lastName: profile?.family_name,
            },
            availability: false,
            isProfileComplete: false,
            status: true,
          });
        }

      }
    }
  } catch (error) {
    res.status(500).json({
      message: "Backend Error",
      status: false,
    });
  }
});

authenticationRoutes.route("/additional-details").post(async (req, res) => {
  console.log("Authentication");
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const gender = req.body.gender;
  const dob = req.body.dob;
  const phoneNumber = req.body.phone;
  const emailAddress = req.body.email;
  const userImage = req.body.userImage;
  const empId = req.body.employeeID;

  const usrCount = await User.find().lean();
  let userRole = "";
  let message;

  if (usrCount.length === 0) {
    if (emailAddress != "ragurajsivanantham@gmail.com") {
      return res.json({
        message:
          "You are currently prohibited from logging in as a Super Admin. If you believe this is an error, please contact the company immediately.",
        status: "verification failed",
      });
    }
    userRole = "Super Admin";
    message = "You are promoted as Super Admin. Please login to continue";
    const isProfileComplete = true;
    const user = new User({ firstName, lastName, gender, dob, phoneNumber, empId, emailAddress, userRole, userImage, isProfileComplete });
    user
      .save()
      .then((item) => res.json({ message: message, status: "success" }))
      .catch((err) => {
        if (err.code === 11000) {
          return res.json({
            message: "User already exists",
            status: "duplicate",
          });
        }
        console.log(err);
        console.log(err);
        res.status(500).send({ error: "Error saving data to the database" });
      });
  }
});

authenticationRoutes.route("/verify/token/:token").get(async (req, res) => {
  console.log("called")
  const token = req.params.token;
  console.log(token)
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.json({
        message: "Token is Invalid or Expired",
        status: false,
        expTime: process.env.JWT_EXP,
      });
    } else {
      return res.json({
        // message: decoded,
        status: true,
        expTime: process.env.JWT_EXP,
      });
    }
  });
});


module.exports = authenticationRoutes;
