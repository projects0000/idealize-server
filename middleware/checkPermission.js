const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (userRoles) => {
  return (req, res, next) => {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json(
        // {
        //   message: "Unauthorized",
        //   status: false,
        // }
      );
    } else {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          return res.status(401).json(
            // {
            //   message: "Unauthorized",
            //   status: false
            // }
          );
        } else {
          if (userRoles.includes(decoded.userData.userRole)) {
            req.currentUser = decoded.userData;
            next()
          }
        }
      });
    }
  }
};

module.exports = auth;
