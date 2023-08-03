const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    userRole: { type: String },
    empId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    dob: { type: Date, required: true },
    phoneNumber: { type: Number, required: true },
    emailAddress: { type: String, required: true, unique: true },
    userStatus: { type: String, default: "active" },
    userImage: { type: String },
    isProfileComplete: { type: Boolean, default: false },
    // department: { type: mongoose.Schema.Types.ObjectId, ref: "DepartmentData" },
  },
  {
    collection: "users",
  }
);

const model = mongoose.model("UserData", User);
module.exports = model;
