const { Router } = require("express");
const SessionsCotroller = require("../Controllers/SessionsController");
const sessionsController = new SessionsCotroller();

const sessionsRoutes = Router();

sessionsRoutes.post("/", sessionsController.create);

module.exports = sessionsRoutes;
