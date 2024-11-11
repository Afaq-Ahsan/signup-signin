const router = require("express").Router();
const JWT = require("../common/auth/jwt");
const employeesController = require("./employees.controller");

router.get("/", employeesController.getEmployee);
router.get("/home", [JWT.verifyAccessToken], employeesController.getMyProfile);

module.exports = router;
