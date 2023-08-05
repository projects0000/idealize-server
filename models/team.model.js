const mongoose = require("mongoose");
const Team = new mongoose.Schema(
  {
    teamName: { type: String, required: true},
  },
  {
    collection: "teams",
  }
);

const model = mongoose.model("TeamData", Team);
module.exports = model;