const { Router } = require("express");
const PlatesController = require("../Controllers/PlatesController");

const plateRoutes = Router();
const platesController = new PlatesController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

plateRoutes.use(ensureAuthenticated);

plateRoutes.post("/", platesController.create);
plateRoutes.get("/", platesController.index);
plateRoutes.put("/", platesController.update);
plateRoutes.delete("/", platesController.delete);


module.exports = plateRoutes;