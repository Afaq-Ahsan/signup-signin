const router = require("express").Router();
const JWT = require("../common/auth/jwt");
const employeesController = require("./employees.controller");
const usersValidation = require("./employees.validation");
const { validate } = require("express-validation");

router.get("/home", [JWT.verifyAccessToken], employeesController.getMyProfile);
router.get(
  "/getAllEmployees",
  [validate(usersValidation.usersList, { keyByField: true })],
  employeesController.getAllEmployess
);
router.get("/", employeesController.getEmployee);

module.exports = router;
