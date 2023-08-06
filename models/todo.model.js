const mongoose = require("mongoose");
const ToDo = new mongoose.Schema(
    {
        userID: { type: String, required: true },
        tasks: [{ type: Object }],
    }
);
const model = mongoose.model("ToDoData", ToDo);
module.exports = model;