const express = require("express");
const authController = require("../controllers/auth.js");

const router = express.Router();

//router.set("view-engine", 'ejs');

router.post("/signup", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/logout", authController.logout);

module.exports = router;