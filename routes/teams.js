const express = require("express");
const teamRoutes = express.Router();
const Team = require("../models/team.model");
require("dotenv").config();

teamRoutes.route("/").get(function (req, res) {
    try {
        Team.find({}, (err, teams) => {
            if (err) {
                res.send(err);
            } else {
                res.json(teams);
            }
        });
    } catch (err) {
        console.log(err);
        res.json({ status: false, message: "Backend Error" });
    }
});

teamRoutes.route("/").post(function (req, res) {
    try{
        const teamName = req.body.teamName;
        Team.findOne({teamName: teamName},(err, teams)=>{
            if(teams){
                return res.json({"message":"Duplicate Team Name Founded  !", status:false});
            }else{
                const newTeam = new Team({teamName: teamName});
                newTeam.save().then((item)=>{
                    return res.json({"message":"Team Added successfully", status:true});
                }).catch((err)=>{
                    console.log(err);
                    return res.json({"message":"Can not add team", status:false});
                })
            }
        })
    } catch(err){
        console.log(err);
    }
});


module.exports = teamRoutes;
