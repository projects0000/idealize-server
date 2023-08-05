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
projectRoutes.put('/update', async (req, res) => {
    const { projectID, softwareArchitect, projectManager, teamLead, developers } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectID,
            {
                softwareArchitect,
                projectManager,
                teamLead,
                developers
            },
            { new: true }
        );

        if (updatedProject) {
            res.json({ status: true, message: 'Project updated successfully.' });
        } else {
            res.json({ status: false, message: 'Project not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'An error occurred while updating the project.' });
    }
});


module.exports = projectRoutes;