const express = require("express");
const adminMiddleware = require("../../middleware/admin.middleware");
const adminSocietyController = require("./admin.society.controller");
const adminFlatController = require("./admin.flats.controller");
const adminOwnerController = require("./admin.owner.controller");
const adminDsahboardController = require("./admin.dashboard.controller");
const adminWorkerController = require("./admin.workers.controller");


const routes = express.Router();

routes.post("/createSociety" , adminSocietyController.createSociety); //done
routes.get("/displaySociety" ,adminSocietyController.displaySociety); //done
routes.patch("/updateSociety/:id" , adminSocietyController.updateSociety); //done
routes.delete("/deleteSociety/:id" , adminSocietyController.deleteSociety ); //done

routes.get("/dashboard" , adminDsahboardController.display) //done


// routes.post("/createFlats/:id" , adminFlatController.createFLat);
routes.get("/displayFlats/:id" , adminFlatController.displayFlats); //done
routes.patch("/updateFlat/:Sid/flats/:Fid" , adminFlatController.updateFlat); //done
routes.delete("/deleteFlat/:Fid" , adminFlatController.deleteFlat); //done

routes.get("/displayOwner/:flatId" , adminOwnerController.displayOwner); //done

routes.get("/displayworker" , adminWorkerController.displayWorker);

module.exports = routes;