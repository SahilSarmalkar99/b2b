const express = require("express");

const authController = require("./auth.controller");

const routes = express.Router();

routes.post("/send-otp", authController.sendOtp);
routes.post("/register", authController.userRegister);
routes.post("/login", authController.userLogin);
routes.post("/logout", authController.userLogout);

module.exports = routes;
