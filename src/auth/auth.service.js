const empolyeesService = require("../employees/employees.service");
const { JWT_TOKEN_TYPES } = require("../../helpers/constants");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const JWT = require("../common/auth/jwt");

exports.signUp = async (signUpDto, result = {}) => {
  try {
    const checkAlreadyAvailable = await empolyeesService.getProfile(
      signUpDto.email
    );

    if (checkAlreadyAvailable.data)
      throw createError(StatusCodes.CONFLICT, "Resource already exists");

    const response = await empolyeesService.create(signUpDto);

    if (response.ex) throw response.ex;

    result.data = response;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.signIn = async (signInDto, result = {}) => {
  try {
    const { email, password } = signInDto;

    const EmployeeExist = await empolyeesService.getProfile(email);

    if (!EmployeeExist.data) {
      result.userNotFound = true;
    } else {
      const user = EmployeeExist.data;

      const isValid = await user.comparePassword(password);

      if (!isValid) {
        result.wrongPassword = true;
      } else {
        const accessToken = await JWT.signToken(
          {
            id: user.id,
            email: user.email,
          },
          JWT_TOKEN_TYPES.ACCESS_TOKEN
        );

        const refreshToken = await JWT.signToken(
          {
            id: user.id,
            email: user.email,
          },
          JWT_TOKEN_TYPES.REFRESH_TOKEN
        );

        result.data = {
          employeeId: user.id,
          accessToken,
          refreshToken,
        };
      }
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.refreshToken = async (refreshTokenDTO, result = {}) => {
  try {
    const { userId } = refreshTokenDTO;

    const response = await empolyeesService.findById(userId);

    if (response.ex) throw response.ex;

    if (!response.data) {
      result.userNotFound = true;
    } else {
      const accessToken = await JWT.signToken(
        { id: response.data.id, email: response.data.email },
        JWT_TOKEN_TYPES.ACCESS_TOKEN
      );

      result.data = { accessToken };
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
