const logger = require("./logger");

// Prints information about every request
const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path: ", request.path);
  logger.info("Body: ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// Error handler
const errorHandler = (error, request, response, next) => {
  logger.info(error.message);
  // Error related to malformatted ids
  if (error.name === "CastError") {
    return response.status(400).send({ error: "wrong format id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
