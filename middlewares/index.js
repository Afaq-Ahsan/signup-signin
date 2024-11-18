const express = require("express");
const errorMiddleware = require("./error.middleware");
const notFoundMiddleware = require("./404.middleware");

module.exports.applyMiddlewares = (app) => {
  // Apply JSON and URL-encoded body parsers for POST/PUT/PATCH requests
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
};

module.exports.applyErrorMdiddlewares = (app) => {
  // Catch-all for handling 404 (Not Found)
  app.use(notFoundMiddleware);

  // General error handling middleware (to catch and format errors)
  app.use(errorMiddleware);
};