const express = require("express");
const path = require('path');
const authController = require("../controllers/auth.js");

const router = express.Router();

router.use(express.static(path.join(__dirname,'../public/MainPage')));

router.get("/", (req, res) =>{
    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        let func = function(name){
            if(name){
                res.render(path.join(__dirname, '../public/MainPage/index'),{
                    name: name
                });
            }
            else{
                res.status(301).redirect("/");
            }
        }   
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, func);     
    }
    else{
        res.status(301).redirect("/");
    }
});


module.exports = router;