const express = require("express");
const ticketController = require("./ticket.controller");
const authMiddleware = require("../../middleware/auth.middleware")

const routes = express.Router();

routes.post("/ticketrise" ,authMiddleware, ticketController.TicketRise)
routes.get("/ticketdisplay" ,authMiddleware, ticketController.TicketDisplay)
routes.get("/activeticket" , authMiddleware , ticketController.ActiveTicket )
routes.get("/pendingticket" , authMiddleware , ticketController.PendingTicket )
routes.get("/historyticket" , authMiddleware , ticketController.HistoryTicket )

module.exports = routes;