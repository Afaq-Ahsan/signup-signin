const express = require("express");
const {
  applyMiddlewares,
  applyErrorMdiddlewares,
} = require("./middlewares/index");
const { initRoute } = require("./src/routers");
const app = express();

(async () => {
  require("./helpers/db");
})();

applyMiddlewares(app);

initRoute(app);

applyErrorMdiddlewares(app);

module.exports = app;
