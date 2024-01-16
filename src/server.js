require("express-async-errors");
require("dotenv/config");

const express = require("express");
const cors = require("cors");

const sqliteConnection = require("./database/sqlite");
const AppError = require("./utils/AppError");
const uploadConfig = require("./configs/uploads");

const routes = require("./routes");

sqliteConnection();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      error: error.message,
    });
  }
  return response.status(500).json({
    status: "error",
    message: error.message,
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
