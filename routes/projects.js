const express = require('express');
const projectRoutes = express.Router();
const Project = require('../models/project.model');

projectRoutes.post("/", async (req, res) => {
    try {
        const { projectName, projectDescription, expectedDate, resourceManager, clientName, clientAddress, clientContactEmail, clientPhoneNumber } = req.body;

        const project = new Project({
            projectName,
            projectDescription,
            expectedDate,
            resourceManager,
            clientName,
            clientAddress,
            clientContactEmail,
            clientPhoneNumber,
            updateStatus: false
        });

        const savedProject = await project.save();
//
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
    const { projectID, softwareArchitect, projectManager, teamLead, developers, gitHubLinks } = req.body;

    try {
        const updatedProject = await Project.findByIdAndUpdate(
            projectID,
            {
                softwareArchitect,
                projectManager,
                teamLead,
                developers,
                gitHubLinks, // Update with GitHub links
                updateStatus: true
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


projectRoutes.get("/resource-manager/:resourceManagerId", async (req, res) => {
    try {
        const resourceManagerId = req.params.resourceManagerId;

        const projects = await Project.find({ "resourceManager": resourceManagerId, "updateStatus": false }, "projectName projectDescription");

        res.json({ status: true, data: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred while fetching projects." });
    }
});

//Get projects by user id
projectRoutes.get("/assigned/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const projects = await Project.find({
            $or: [
                { "resourceManager": userId },
                { "developers": userId },
                { "projectManager": userId },
                { "softwareArchitect": userId },
                { "teamLead": userId }
            ]
        }, "projectName projectDescription"); // Include projectDescription in the query

        res.json({ status: true, data: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred while fetching projects." });
    }
});

//Get project details by project id
projectRoutes.get("/:projectId", async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ status: false, message: "Project not found." });
        }

        res.json({ status: true, data: project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred while fetching the project." });
    }
});

//Get all projects
projectRoutes.get("/", async (req, res) => {
    try {
        const projects = await Project.find();

        res.json({ status: true, data: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: "An error occurred while fetching projects." });
    }
});



module.exports = projectRoutes;