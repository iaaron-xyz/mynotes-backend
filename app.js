const config = require("./utils/config");

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

// mongo connection paramters
mongoose.set("strictQuery", false);

// user feecback about the connection status
logger.info("connecting to", config.MONGODB_URI.slice(0, 20), "...");

// Connect to database
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.info("error connecting to MongoDB:", error.message);
  });

// CALL MIDDLEWARES
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

// Routes
app.use("/api/notes", notesRouter);

// Last middlewares
app.use(middleware.unknownEndpoint); // wrong urls
app.use(middleware.errorHandler); // MIDDLEWARE to handle errors in requests

module.exports = app;
