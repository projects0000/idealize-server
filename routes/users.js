const express = require("express");
const userRoutes = express.Router();
const User = require("../models/user.model");
const sendMail = require("../mail/mailer");
const auth = require("../middleware/checkPermission");
const ur = require("../userRoles/userRoles");

userRoutes.route("/").post(async (req, res) => {
  try {
    if (req.body.gender === "Male") {
      req.body.userImage = `${req.protocol}://${req.get('host')}/images/gender/male.png`
    } else if (req.body.gender === "Female") {
      req.body.userImage = `${req.protocol}://${req.get('host')}/images/gender/female.png`
    } else {
      req.body.userImage = `${req.protocol}://${req.get('host')}/images/gender/other.png`
    }

    const user = new User(req.body);
    user.save().then((user) => {
      return res.json({ message: "User Added Successfully", status: true });
    }).catch((err) => {
      if (err.code === 11000) {
        return res.json({ message: "Duplicate User Found", status: false });
      } else {
        return res.json({ message: "Unknown Error", status: false });
      }
    })
  } catch (error) {
    console.error(error);
    return res.json({ message: "Internal Server Error", status: false });
  }
});

userRoutes.route("/").get(auth(ur.all), async (req, res) => {
  try {
    User.find({}, (err, users) => {
      if (users) {
        res.json({ response: users, status: true });
      } else {
        res.json({ response: "Error occured", status: false });
      }
    })
  } catch (err) {
    res.json({ response: "Internal Server Error", status: false });
  }
});

userRoutes.route("/empty").get(async (req, res) => {
  try {
    const documents = await User.find().lean();
    const isEmpty = documents.length === 0;
    res.status(200).json({ status: isEmpty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

userRoutes.get('/software-architects', async (req, res) => {
  try {
    const softwareArchitects = await User.find({ userRole: 'Software Architect' }, '_id firstName lastName');
    res.json({ status: true, data: softwareArchitects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'An error occurred while fetching Software Architects.' });
  }
});

userRoutes.get('/resource-management', async (req, res) => {
  try {
    const resourseManager = await User.find({ userRole: 'Resource Management' }, '_id firstName lastName');
    res.json({ status: true, data: resourseManager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'An error occurred while fetching Resource Management.' });
  }
});

userRoutes.get('/project-managers', async (req, res) => {
  try {
    const projectManager = await User.find({ userRole: 'Project Manager' }, '_id firstName lastName');
    res.json({ status: true, data: projectManager });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'An error occurred while fetching Project Manager.' });
  }
});

userRoutes.get('/developers', async (req, res) => {
  try {
    const developer = await User.find({ userRole: 'Developer' }, '_id firstName lastName');
    res.json({ status: true, data: developer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: 'An error occurred while fetching Developer.' });
  }
});

userRoutes.route("/current-user").get(auth(ur.all), function (req, res) {
  const userID = req.currentUser._id;
  User.find({ _id: userID })
    .exec((err, users) => {
      if (err) {
        res.json({ response: "An error occurred while fetch", status: false });
      } else {
        res.json({ response: users, status: true });
      }
    });
});

userRoutes.route("/:id").get(auth(ur.all), function (req, res) {
  const userID = req.params.id;
  User.find({ _id: userID })
    .exec((err, users) => {
      if (err) {
        res.json({ response: "An error occurred while fetch", status: false });
      } else {
        res.json({ response: users, status: true });
      }
    });
});

userRoutes.route("/aggregate/user-role").get(auth(ur.all), function (req, res) {
  User.aggregate([
    {
      $group: {
        _id: '$userRole',
        users: { $push: '$$ROOT' },
      },
    },
    {
      $sort: {
        _id: -1,
      },
    },
  ])
    .exec((err, groupedUsers) => {
      if (err) {
        res.json({ response: 'Error occurred', status: false });
      } else {
        res.json({ response: groupedUsers, status: true });
      }
    });
});

userRoutes.route("/aggregate/team").get(auth(ur.all), function (req, res) {
  User.aggregate([
    {
      $match: {
        team: { $ne: null }
      }
    },
    {
      $group: {
        _id: '$team',
        users: { $push: '$$ROOT' },
      },
    },
    {
      $lookup: {
        from: 'teams',
        localField: '_id',
        foreignField: '_id',
        as: 'teamInfo',
      },
    },
    {
      $unwind: '$teamInfo',
    },
    {
      $project: {
        _id: 1,
        teamName: '$teamInfo.teamName',
        users: 1,
      },
    },
  ])
    .exec((err, groupedUsers) => {
      if (err) {
        res.json({ response: 'Error occurred', status: false });
      } else {
        res.json({ response: groupedUsers, status: true });
      }
    });
});

module.exports = userRoutes;