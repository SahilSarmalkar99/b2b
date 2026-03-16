const express = require("express");
const workerController = require("./worker.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const routes = express.Router();

routes.get("/workerprofile" , authMiddleware , workerController.WorkerProfile)
routes.get("/workerdashboard" , authMiddleware , workerController.WorkerDashboard)
routes.post("/editprofile",authMiddleware , workerController.EditProfile);
routes.get("/pendingticket" ,authMiddleware, workerController.WorkerPendingTickets);
routes.get("/activeticket" ,authMiddleware, workerController.WorkerActiveTickets);
routes.post("/accept-ticket/:tid" ,authMiddleware, workerController.AcceptTicket);
routes.put("/workerskills",authMiddleware, workerController.UpdateWorkerSkills);

module.exports = routes;