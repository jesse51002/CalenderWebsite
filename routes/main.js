const e = require("express");
const express = require("express");
const path = require('path');
const authController = require("../controllers/auth.js");

const router = express.Router();

router.use(express.static(path.join(__dirname,'../public/MainPage')));

router.get("/", (req, res) =>{
    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){ 
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                res.render(path.join(__dirname, '../public/MainPage/index'),{
                    name: name
                });
            }
            else{
                res.status(301).redirect("/");
            }
        });     
    }
    else{
        res.status(301).redirect("/");
    }
});

router.post("/makeNewScheduale", (req,res) =>{

    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let data = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        for(let i = 0; i < currentData.scheduales.length; i++){
                            if(currentData.scheduales[i].name === data.name){
                                return res.status(401).json("SchedualeNameUsed");
                            }
                        }
                        currentData.scheduales[currentData.scheduales.length] = data;

                        authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                            if(data === null){
                                console.log("Set Data Error main::\n" + error);
                            }
                            else{
                                console.log("Saved " + cookies.CalderWebsiteEmail + " data into the database");
                            }
                        } );
                        res.status(201).json(data.name);
                    }
                });

            }
            else{
                res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        res.status(401).json("No login info provided");
    }

    
});

router.post("/makeNewEvent", (req,res) =>{
    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let data = req.body;
                
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        for(let i = 0; i < currentData.events.length; i++){
                            if(currentData.events[i].name === data.name){
                                return res.status(401).json("EventNameUsed");
                            }
                        }
                        currentData.events[currentData.events.length] = data;

                        authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                            if(data === null){
                                console.log("Set Data Error main::\n" + error);
                            }
                            else{
                                console.log("Saved " + cookies.CalderWebsiteEmail + " data into the database");
                            }
                        } );
                        res.status(201).json(data.name);
                    }
                });

            }
            else{
                res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        res.status(401).json("No login info provided");
    }
});

router.get("/GetCalenderData", (req,res) => {
    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(currentData){
                        res.status(201).json(currentData);
                    }
                    else{
                        res.status(501).json("There is no data in the system for \n" + cookies.CalderWebsiteEmail + "\"");
                    }
                });
            }
            else{
                res.status(401).json("Invalid log in info");
            }
        });
    }
});

module.exports = router;