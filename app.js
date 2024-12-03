const express = require("express");
const {
  applyMiddlewares,
  applyErrorMdiddlewares,
} = require("./middlewares/index");
const { initRoute } = require("./src/routers");
const redisClient = require("./helpers/redis");
const app = express();

(async () => {
  await redisClient.connect();

  require("./helpers/db");
})();

applyMiddlewares(app);

initRoute(app);

applyErrorMdiddlewares(app);

module.exports = app;
