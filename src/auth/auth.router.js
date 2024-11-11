const router = require("express").Router();
const authController = require("./auth.controller");
const { validate } = require("express-validation");
const authValidation = require("./auth.validation");
const JWT = require("../common/auth/jwt");

router.post(
  "/signup",
  [validate(authValidation.signup, { keyByField: true })],
  authController.signup
);

router.post(
  "/signin",
  [validate(authValidation.signIn, { keyByField: true })],
  authController.signin
);

router.post(
  "/refreshToken",
  [
    validate(authValidation.generateNewAccessToken, { keyByField: true }),
    JWT.verifyRefreshToken,
  ],
  authController.refreshToken
);

module.exports = router;
