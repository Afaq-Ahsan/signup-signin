const router = require("express").Router();
const JWT = require("../common/auth/jwt");
const employeesController = require("./employees.controller");
const usersValidation = require("./employees.validation");
const { validate } = require("express-validation");

router.get("/", employeesController.getEmployee);
router.get("/home", [JWT.verifyAccessToken], employeesController.getMyProfile);
router.get("/getAllEmployees",validate(usersValidation.usersList, { keyByField: true }),employeesController.getAllEmployess)

module.exports = router;
