const express = require('express');
const sql = require("mysql");
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const authController = require("./controllers/auth.js");
const { Console } = require('console');

const app = express();

dotenv.config({path: './.env'});

var database = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});




database.connect((error) => {
    if(error){
        console.log(error);
    }
    else{
        console.log("MySQL database connected");
    }
});



app.listen(5000, () => console.log("Listening at 5000"));
app.set("view engine", 'ejs');
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}))

app.use("/auth", require("./routes/auth.js"))
app.use("/main", require("./routes/main.js"))

app.use(express.static('public/LandingPage'));

app.get("/", async (req, res) =>{
    const {cookies} = req;

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        let func = function(name){
            if(name){
                res.render(
                    path.join(__dirname, 'public/LandingPage/index.ejs'),
                        {name: name}
                );
            }
            else{
                res.render(
                    path.join(__dirname, 'public/LandingPage/index.ejs'),
                        {name: null}
                );
            }
        }   
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, func);     
    }
    else{
        res.render(
            path.join(__dirname, 'public/LandingPage/index.ejs'),
                {name: null}
        );
    }
    

});

app.use('/login',express.static(path.join(__dirname, 'public/LoginPage')));
app.get("/login", (req, res) =>{

    const {cookies} = req

    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        let func = function(name){
            if(name){
                return res.status(301).redirect("/");
            }
            else{
                res.render(
                    path.join(__dirname, 'public/LoginPage/index.ejs')
                )
            }
        }   
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, func);
    }
    else{
        res.render(
            path.join(__dirname, 'public/LoginPage/index.ejs')
        )
    }  
});

app.use('/signup',express.static(path.join(__dirname, 'public/SignUpPage')));
app.get("/signup", (req, res) =>{
    const {cookies} = req


    if('CalderWebsiteEmail' in cookies && 'CalderWebsitePassword' in cookies){
        let func = function(name){
            if(name){
                return res.status(301).redirect("/");
            }
            else{
                res.render(
                    path.join(__dirname, 'public/SignUpPage/index.ejs')
                );
            }
        }   
        authController.checkIdentity(cookies.CalderWebsiteEmail , cookies.CalderWebsitePassword, func);
    }
    else{
        res.render(
            path.join(__dirname, 'public/SignUpPage/index.ejs')
        );
    }
});

