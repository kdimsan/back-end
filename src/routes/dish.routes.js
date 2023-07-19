const { Router } = require("express");
const DishController = require("../Controllers/DishController");

const dishRoutes = Router();
const dishController = new DishController();

dishRoutes.post("/", dishController.create);
dishRoutes.get("/", dishController.index);
dishRoutes.put("/", dishController.update);
dishRoutes.delete("/", dishController.delete);


module.exports = dishRoutes;