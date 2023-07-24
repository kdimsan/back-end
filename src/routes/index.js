const { Router } = require("express");

const usersRoutes = require("./user.routes");
const plateRoutes = require("./plate.routes");
const sessionsRoutes = require("./sessions.routes");
const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/pratos", plateRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;