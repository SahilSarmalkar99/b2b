const express = require("express");
const workerController = require("./worker.controller");
const routes = express.Router();

routes.post("/workerprofile/:worker_id" , workerController.WorkerProfile);
routes.get("/workerticket/:worker_id" , workerController.Workerticket);
routes.post("/accept-ticket/:wid/:tid" , workerController.AcceptTicket);
routes.put("/worker/:worker_id/skills", workerController.UpdateWorkerSkills);

module.exports = routes;