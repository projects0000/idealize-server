const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        projectDescription: { type: String },
        expectedDate: { type: Date },
        softwareArchitect: { type: Object },
        resourceManager: { type: Object },
        projectManager: { type: Object },
        teamLead: { type: Object },
        developers: [{ type: Object }],
    },
    {
        collection: "projects",
    }
);

const model = mongoose.model("ProjectData", ProjectSchema); // Use ProjectSchema here
module.exports = model;
