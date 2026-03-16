const express = require("express");
const OwnerController = require("./owner.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const routes = express.Router();

routes.post("/ownerprofile" , authMiddleware,OwnerController.OwnerProfile);
routes.put("/editprofile", authMiddleware ,OwnerController.ProfileEdit );
routes.post("/verify-phone" , authMiddleware ,OwnerController.VerifyPhoneChange );
routes.get("/owner-dashboard" , authMiddleware ,OwnerController.OwnerDashboard );

// Society
routes.get("/societies", authMiddleware,OwnerController.GetAllSocieties);
routes.post("/add-society", authMiddleware,OwnerController.AddSocietyToOwner);
routes.get("/societies", authMiddleware,OwnerController.GetOwnerSocieties);
routes.post("/add-flat", authMiddleware,OwnerController.AddFlat);
routes.get("/society-flats/:society_id", authMiddleware,OwnerController.GetSocietyFlats);

module.exports = routes;
