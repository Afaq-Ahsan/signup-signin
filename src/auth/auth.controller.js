const createError = require("http-errors");
const { StatusCodes, getStatusCode } = require("http-status-codes");
const authService = require("./auth.service");

exports.signup = async (req, res, next) => {
  try {
    const signUpDto = req.body;

    const result = await authService.signUp(signUpDto);

    if (result.ex) throw result.ex;

    if (result.alreadyAvailable) {
      throw new createError(StatusCodes.CONFLICT, "user already available");
    }

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

exports.forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const result = await authService.forgetPassword({ email });

    if (result.ex) throw result.ex;

    if (result.userNotFound) {
      throw new createError(StatusCodes.NOT_FOUND, "User Not found");
    } else {
      return res.status(StatusCodes.OK).json({
        statusCode: StatusCodes.OK,
        message: "OTP sent Successfully",
        data: result.data,
      });
    }
  } catch (ex) {
    next(ex);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const result = await authService.resetPassword(req.body);

    if (result.ex) throw result.ex;
    if (result.isError) {
      throw new createError(StatusCodes.BAD_REQUEST, result.message);
    }

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "Password reset successfully",
      data: result.data,
    });
  } catch (ex) {
    next(ex);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const logoutDto = {
      userId: req.user.id,
    };

    const result = await authService.logout(logoutDto);

    if (result.ex) throw result.ex;

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "LogOut Successful",
    });
  } catch (ex) {
    next(ex);
  }
};
