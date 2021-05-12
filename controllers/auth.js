const sql = require("mysql");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

dotenv.config({path: './.env'});

var database = sql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

console.log({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
} );

exports.register = (req,res) =>{
    console.log(req.body);

    const {email, username, password} = req.body;

    database.query("SELECT email FROM users WHERE email = ?", [email], async (error, results) =>{
        if(error){
            console.log(error);
            return res.send(error);
        }

        if(results.length > 0){
            return res.send("Email in use");
        }
        
        let hashedPassword = await bcrypt.hash(password,8);

        database.query("INSERT INTO users SET ?", {name: username, email: email, password: hashedPassword, UserCalenderData: "{}"}, (error, results) =>{
            if(error){
                return res.send(error);
            }
            else{
                return res.status(301).redirect("/login");
            }

        });
    });
};

exports.login = async (req,res) => {
    try{
        const {email, password} = req.body;

        if(!email ||!password){
            return res.status(401).send("Input a email and password");
        }

        database.query("SELECT * FROM users WHERE email = ?", [email], async (error, results) =>{
            if(error){
                return res.status(401).send(error);
            }

            if(!results || results.length === 0 || !(await bcrypt.compare(password, results[0].password))){
                return res.status(301).redirect("/login");
            }
            else{
                const  id =results[0].id;
                const token = jwt.sign({id}, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });
                console.log("The token is: " + token);

                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 *60 * 1000
                    ),
                    httpOnly: true
                }

                res.cookie('CalderWebsiteEmail', email, cookieOptions);
                res.cookie('CalderWebsitePassword', results[0].password, cookieOptions);
                return res.status(301).redirect("/");
            }
        });


    }catch(error){

    }
};

exports.logout = async (req,res) => {
    const cookieOptions = {
        expires: new Date(
            0
        ),
        httpOnly: true
    }

    console.log("Logging out");

    res.cookie('CalderWebsiteEmail', "", cookieOptions);
    res.cookie('CalderWebsitePassword', "", cookieOptions);
    res.status(301).redirect("/");
}

exports.checkIdentity = async (email, password, callback) =>{
    console.log("Trying to authenciate\n Email: " + email + "\nPassword: " + password + "\n");

    
    database.query("SELECT * FROM users WHERE email = ?", [email], (error, results) =>{
        if(error || results.length <= 0 ){
            callback(null);
        }

        if(!results || password != results[0].password){
            callback(null);
        }
        else{
            console.log(results[0].name);
            callback(results[0].name);
        }
    });
   
}

exports.GetCalenderData = async (email, password, callback) =>{
    console.log("Getting JSON info for\n Email: " + email + "\nPassword: " + password + "\n");

    
    database.query("SELECT * FROM users WHERE email = ?", [email], (error, results) =>{
        if(error || results.length <= 0 ){
            return callback(null);
        }

        if(!results || password != results[0].password){
            return callback(null);
        }
        else{
            username=  results[0].name;
            let data;
            if(results[0].UserCalenderData.length === 0){
                data = {};
            }
            else{
                data = JSON.parse(results[0].UserCalenderData);
            }
            if(!data.scheduales){
                data.scheduales = [];
            }
            if(!data.events){
                data.events = [];
            }
            //data.scheduales = [];
            //data.events = [];

            exports.SetCalenderData(email, password, data, (d, error) =>{
                if(!d){
                    console.log("Set Data Error auth::\n" + error);
 

                    return callback(null);
                }
                else{
                    return callback(data);
                }
            });
        }
    });
   
}

exports.SetCalenderData = (email, password, data, callback) => {

    let jsonData = JSON.stringify(data);

    let sql = "UPDATE users SET UserCalenderData = ? WHERE email = ?";
    //let sql = "SELECT @UserCalenderData = ? FROM users WHERE email = ?";
    database.query(sql, [jsonData, email], (error, results) =>{
        if(error){
            return callback(null, error);
        }
        else{
            return callback(true);
        }
    });
}