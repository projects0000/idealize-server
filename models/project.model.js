const mongoose = require("mongoose");

const Project = new mongoose.Schema(
    {
        projectName: { type: String, required: true },
        projectDescription: { type: String, required: true },
        expectedDate: { type: Date, required: true },
        softwareArchitect: { type: Object },
        resourceManagerID: { type: Object },
        projectManagerID: { type: Object },
        developers: [{ type: Object }],
    },
    {
        collection: "projects",
    }
);

const ProjectModel = mongoose.model("ProjectData", Project);
module.exports = ProjectModel;
