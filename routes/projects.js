const express = require('express');
const projectRoutes = express.Router();
const Project = require('../models/project.model');

projectRoutes.route("/projects").post(function (req, res) {
    try {
        const projectName = req.body.projectName;

        const Project = new Project({
            projectName
        });

        Project
            .save()
            .then((item) => {
                res.json({
                    message: "Project added successfully",
                    status: true,
                });
            })
            .catch((err) => {
                if (err.code === 11000) {
                    res.json({
                        message: "Project already exists",
                        status: false,
                    });
                } else {
                    res.status(500).send({ error: "Error saving data to the database" });
                }
            });
    } catch (error) {
        console.log("Error occurred:", error);
        res.json([{ message: "Data not found", status: false }]);
    }
});

module.exports = projectRoutes;