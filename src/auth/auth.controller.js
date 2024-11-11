const createError = require("http-errors");
const { StatusCodes, getStatusCode } = require("http-status-codes");
const authService = require("./auth.service");
const empolyeesService = require("../employees/employees.service");

exports.signup = async (req, res, next) => {
  try {
    const signUpDto = req.body;

    const result = await authService.signUp(signUpDto);

    if (result.ex) throw result.ex;

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: "signUp Successful",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.signin = async (req, res, next) => {
  try {
    const signInDto = req.body;

    const result = await authService.signIn(signInDto);

    if (result.ex) throw result.ex;

    if (result.userNotFound)
      throw new createError(StatusCodes.NOT_FOUND, "User Not found");

    if (result.wrongPassword)
      throw new createError(StatusCodes.UNAUTHORIZED, "Unauthorized User");

    res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: "signIn Succesfullllll",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshTokenDTO = req.user;

    const result = await authService.refreshToken(refreshTokenDTO);

    if (result.ex) throw result.ex;

    if (result.userNotFound) throw createError.Unauthorized();

    return res.status(StatusCodes.CREATED).json({
      statusCode: StatusCodes.CREATED,
      message: "Access Token Creation Successful",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};
