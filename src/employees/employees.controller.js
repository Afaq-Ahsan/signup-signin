const empolyeesService = require("./employees.service");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");

exports.getEmployee = async (req, res, next) => {
  try {
    const email = req.body.email;

    const result = await empolyeesService.getProfile(email);

    if (result.ex) throw result.ex;

    if (!result.data)
      throw createError(StatusCodes.NOT_FOUND, "User not found");

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "My Profile",
      data: result.data,
    });
  } catch (ex) {
    console.log("ex", ex);
    next(ex);
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = req.body;

    const result = await empolyeesService.getProfile(user.email);
    if (!result) {
      throw createError(StatusCodes.NOT_FOUND, "user Not Found");
    } else {
      return res.status(StatusCodes.OK).json({ msg: `WELCOME :)` });
    }
  } catch (error) {
    next(error);
  }
};
