const express = require("express");
const toDoRoute = express.Router();
const ToDo = require("../models/todo.model");
const auth = require("../middleware/checkPermission");
const ur = require("../userRoles/userRoles");

toDoRoute.route("/").post(auth(ur.all), function (req, res) {
    const userID = req.currentUser._id;
    const task = req.body.taskName;
    const dueDate = req.body.dueDate;
    const newTask = {
        taskid: Date.now(),
        taskName: task,
        taskStatus: false,
        createdDate: Date.now(),
        dueDate: dueDate
    };
    ToDo.findOneAndUpdate({ userID: userID }, { $push: { tasks: newTask } }, { upsert: true, new: true }, (err, user) => {
        if (err) {
            return res.json({
                message: "Error try again !",
                status: false,
            });
        } else {
            return res.json({
                message: "Task Added Successfully",
                status: true,
            });
        }
    });
});

toDoRoute.route("/").get(auth(ur.all), function (req, res) {
    const userID = req.currentUser._id;
    ToDo.find({ userID: userID }, (err, users) => {
        if (err) {
            res.send(err);
        } else {
            res.json(users);
        }
    });
});

toDoRoute.route("/done").post(auth(ur.all), function (req, res) {
    const todoID = req.body.todoid;
    const taskID = req.body.taskid;
    ToDo.findById(todoID, function (err, todo) {
        todo.tasks.find((tasks) => tasks.taskid === taskID).taskStatus = true;
        ToDo.updateOne({ _id: todoID }, { $set: { tasks: todo.tasks, }, })
            .then((result) => {
                return res.json({
                    message: "Task Marked as Done",
                    status: true,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.json({
                    message: "Error",
                    status: false,
                });
            });
    });
    console.log(taskID);
});

toDoRoute.route("/delete").post(auth(ur.all), function (req, res) {
    const todoID = req.body.todoid;
    const taskID = req.body.taskid;
    ToDo.findById(todoID, function (err, todo) {
        todo.tasks = todo.tasks.filter((task) => task.taskid !== taskID);
        ToDo.updateOne({ _id: todoID }, { $set: { tasks: todo.tasks, } }
        )
            .then((result) => {
                return res.json({
                    message: "Task Deleted",
                    status: true,
                });
            })
            .catch((err) => {
                console.log(err);
                return res.json({
                    message: "Error",
                    status: false,
                });
            });
    });
});

module.exports = toDoRoute;