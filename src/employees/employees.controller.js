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
    const user = req.user;

    console.log("user is : ", user);

    const result = await empolyeesService.getProfile(user.email);

    console.log("result is : ", result.data);
    if (!result) {
      throw createError(StatusCodes.NOT_FOUND, "user Not Found");
    } else {
      return res
        .status(StatusCodes.OK)
        .json({ msg: `WELCOME ${result.data.employeeName} :)` });
    }
  } catch (error) {
    next(error);
  }
};
// http://localhost:3000/employees/getAllEmployees/?limit=5&offset=1
exports.getAllEmployess = async (req, res, next) => {
  try {
    const geEmployeeListsDto = req.query;

    const result = await empolyeesService.getEmployeeList(geEmployeeListsDto);

    if (result.ex) throw result.ex;

    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      message: "All Users list",
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};
