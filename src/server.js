require("express-async-errors");
const express = require("express");

const sqliteConnection = require("./database/sqlite");
const AppError = require("./utils/AppError");

const routes = require("./routes");

sqliteConnection();

const app = express();
app.use(express.json());

app.use(routes);

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error", 
            error: error.message
        });
    }
    return response.status(500).json({
        status:"error", 
        message: error.message
    });
})

const PORT = 3333;

app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`));