const express = require('express');
const projectRoutes = express.Router();
const Project = require('../models/project.model');

projectRoutes.route("/").post(async function (req, res) {
    try {
        const { projectName, projectDescription, expectedDate, resourceManager } = req.body;

        const project = new Project({
            projectName,
            projectDescription,
            expectedDate,
            resourceManager
        });

        const savedProject = await project.save();

        res.json({
            message: "Project added successfully",
            status: true,
            data: savedProject
        });
    } catch (error) {
        console.log("Error occurred:", error);
        res.status(500).json({ message: "Error saving project", status: false });
    }
});

module.exports = projectRoutes;