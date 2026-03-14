const express = require("express");
const OwnerModel = require("./owner.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const routes = express.Router();

routes.post("/ownerprofile" , authMiddleware,OwnerModel.OwnerProfile);
routes.put("/editprofile", authMiddleware ,OwnerModel.ProfileEdit );
routes.post("/verify-phone" , authMiddleware ,OwnerModel.VerifyPhoneChange );
routes.get("/owner-dashboard" , authMiddleware ,OwnerModel.OwnerDashboard );

module.exports = routes;
