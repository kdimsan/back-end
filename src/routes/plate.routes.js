const { Router } = require("express");

const PlatesController = require("../Controllers/PlatesController");
const PlatesImageController = require("../Controllers/PlatesImageController");

const multer = require("multer");
const uploadConfig = require("../configs/uploads");

const plateRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const platesController = new PlatesController();
const platesImageController = new PlatesImageController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

plateRoutes.use(ensureAuthenticated);

plateRoutes.post("/", upload.single("image"), platesController.create);
plateRoutes.get("/", platesController.index);
plateRoutes.get("/:id", platesController.show);
plateRoutes.put("/:id", platesController.update);
plateRoutes.delete("/:id", platesController.delete);
plateRoutes.patch("/image", upload.single("image"), platesImageController.update);


module.exports = plateRoutes;