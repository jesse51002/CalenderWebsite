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
                let reqData = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        for(let i = 0; i < currentData.scheduales.length; i++){
                            if(currentData.scheduales[i].name === reqData.name){
                                return res.status(401).json("SchedualeNameUsed");
                            }
                        }
                        currentData.scheduales[currentData.scheduales.length] = reqData;

                        authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                            if(data === null){
                                console.log("Set Data Error main::\n" + error);
                                return res.status(501).json("Could not save the scheduale onto the database\n" + error);
                            }
                            else{
                                console.log("Saved " + cookies.CalderWebsiteEmail + " data into the database");
                                return res.status(201).json(reqData.name);
                            }
                        } );
                        
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
    }

    
});

router.post("/editScheduale", (req,res) =>{

    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let reqData = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        let foundSched = false;
                        for(let i = 0; i < currentData.scheduales.length; i++){
                            if(currentData.scheduales[i].name === reqData.name){
                                currentData.scheduales[i] = reqData.data;
                                foundSched = true;

                                authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                                    if(data === null){
                                        console.log("Set Data Error main::\n" + error);
                                        return res.status(501).json("Could not edit the data on the server" +"\n" + error);
                                    }
                                    else{
                                        console.log("Edited the data of " + cookies.CalderWebsiteEmail + " data in the database");
                                        
                                        return res.status(201).json(reqData.data.name);
                                    }
                                } );

                                break;
                            }
                        }
                        if(!foundSched){
                            return res.status(501).json("Could not find the scheduale trying to be edited");
                        }
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
    }

    
});

router.post("/deleteScheduale", (req,res) =>{

    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let reqData = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        let foundSched = false;
                        for(let i = 0; i < currentData.scheduales.length; i++){
                            if(currentData.scheduales[i].name === reqData.name){
                                currentData.scheduales.splice(i,1);
                                foundSched = true;

                                authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                                    if(data === null){
                                        console.log("Set Data Error main::\n" + error);
                                        return res.status(501).json("Could not edit the data on the server" +"\n" + error);
                                    }
                                    else{
                                        console.log("Edited the data of " + cookies.CalderWebsiteEmail + " data in the database");
                                        
                                        return res.status(201).json(reqData.name);
                                    }
                                } );
                                break;
                            }
                        }
                        if(!foundSched){
                            return res.status(501).json("Could not find the scheduale trying to be deleted");
                        }
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
    } 
});


router.post("/editEvent", (req,res) =>{

    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let reqData = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        let foundEvent = false;
                        for(let i = 0; i < currentData.events.length; i++){
                            if(currentData.events[i].name === reqData.name){
                                currentData.events[i] = reqData.data;
                                foundEvent = true;

                                authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                                    if(data === null){
                                        console.log("Set Data Error main::\n" + error);
                                        return res.status(501).json("Could not edit the data on the server" +"\n" + error);
                                    }
                                    else{
                                        console.log("Edited the data of " + cookies.CalderWebsiteEmail + " data in the database");
                                        
                                        return res.status(201).json(reqData.data.name);
                                    }
                                } );

                                break;
                            }
                        }
                        if(!foundEvent){
                            return res.status(501).json("Could not find the event trying to be edited");
                        }
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
    } 
});

router.post("/deleteEvent", (req,res) =>{

    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (name) => {
            if(name){
                let reqData = req.body;
              
                authController.GetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, (currentData) => {
                    if(!currentData){
                        return res.status(501).json("Couldn't find any data");
                    }
                    else{
                        let foundEvent = false;
                        for(let i = 0; i < currentData.events.length; i++){
                            if(currentData.events[i].name === reqData.name){
                                currentData.events.splice(i,1);
                                foundEvent = true;

                                authController.SetCalenderData(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, currentData , (data, error) => {
                                    if(data === null){
                                        console.log("Set Data Error main::\n" + error);
                                        return res.status(501).json("Could not edit the data on the server" +"\n" + error);
                                    }
                                    else{
                                        console.log("Edited the data of " + cookies.CalderWebsiteEmail + " data in the database");
                                        
                                        return res.status(201).json(reqData.name);
                                    }
                                } );
                                break;
                            }
                        }
                        if(!foundEvent){
                            return res.status(501).json("Could not find the event trying to be deleted");
                        }
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
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
                                return res.status(501).json("Could not save the event to the database\n" + error);
                            }
                            else{
                                console.log("Saved " + cookies.CalderWebsiteEmail + " data into the database");
                                return res.status(201).json(data.name);
                            }
                        } );
                        
                    }
                });

            }
            else{
                return res.status(401).json("Invalid login info");
            }
        });     
    }
    else{
        return res.status(401).json("No login info provided");
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