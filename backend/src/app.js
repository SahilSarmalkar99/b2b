const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./modules/auth/auth.routes");
const adminRoutes = require("./modules/admin/admin.routes");
const ownerRoutes = require("./modules/owner/owner.routes");
const ticketRoutes = require("./modules/tickets/ticket.routes");
const workerRoutes = require("./modules/worker/worker.routes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://yourfrontend.com"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);


app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ticket", ticketRoutes);
app.use("/api/worker", workerRoutes);
app.use("/api/owner", ownerRoutes);

module.exports = app;