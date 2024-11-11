const express = require("express");
const errorMiddleware = require("./error.middleware");
const notFoundMiddleware = require("./404.middleware");

module.exports.applyMiddlewares = (app) => {
  
    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ extended: true }));
  
  };

  module.exports.applyErrorMdiddlewares = (app) => {
    app.use(notFoundMiddleware);
    app.use(errorMiddleware);
  };
  
  