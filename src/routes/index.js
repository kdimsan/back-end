const { Router } = require("express");

const usersRoutes = require("./user.routes");
const dishRoutes = require("./dish.routes");
const sessionsRoutes = require("./sessions.routes");
const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/pratos", dishRoutes);
routes.use("/sessions", sessionsRoutes);

module.exports = routes;