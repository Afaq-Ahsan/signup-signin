const empolyeesService = require("../employees/employees.service");
const { JWT_TOKEN_TYPES } = require("../../helpers/constants");
const createError = require("http-errors");
const { StatusCodes } = require("http-status-codes");
const JWT = require("../common/auth/jwt");
const OTP = require("../common/utils/otp");
const UserForgetPassword = require("./auth.model");
const redisClient = require("../../helpers/redis");
const configs = require("../../configs");

exports.signUp = async (signUpDto, result = {}) => {
  try {
    const employee = await empolyeesService.getProfile(
      signUpDto.email
    );

    if (employee.data){
      result.alreadyAvailable = true;
    }
      // throw createError(StatusCodes.CONFLICT, "Resource already exists");

    const response = await empolyeesService.create(signUpDto);

    // if (response.ex) throw response.ex;

    result.data = response;
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.signIn = async (signInDto, result = {}) => {
  try {
    const { email, password, rememberMe } = signInDto;

    const EmployeeExist = await empolyeesService.getProfile(email);

    if (!EmployeeExist.data) {
      result.userNotFound = true;
    } else {
      const user = EmployeeExist.data;

      const isValid = await user.comparePassword(password);

      if (!isValid) {
        result.wrongPassword = true;
      } else {
        // const accessToken = await JWT.signToken(
        //   {
        //     id: user.id,
        //     email: user.email,
        //   },
        //   JWT_TOKEN_TYPES.ACCESS_TOKEN
        // );

        // const refreshToken = await JWT.signToken(
        //   {
        //     id: user.id,
        //     email: user.email,
        //   },
        //   JWT_TOKEN_TYPES.REFRESH_TOKEN
        // );

        const [accessToken, refreshToken] = await Promise.all([
          JWT.signToken(
            {
              id: user.id,
              email: user.email,
            },
            JWT_TOKEN_TYPES.ACCESS_TOKEN
          ),
          JWT.signToken(
            {
              id: user.id,
              email: user.email,
            },
            JWT_TOKEN_TYPES.REFRESH_TOKEN,
            rememberMe
          ),
        ]);

        rememberMe
          ? await redisClient.set(user.id.toString(), refreshToken, {
              EX: configs.jwt.refreshToken.redisRemeberMeTTL,
            })
          : await redisClient.set(user.id.toString(), refreshToken, {
              EX: configs.jwt.refreshToken.redisTTL,
            });

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

exports.forgetPassword = async (forgetPasswordDTO, result = {}) => {
  try {
    const { email } = forgetPasswordDTO;

    const userExist = await empolyeesService.getProfile(email);

    if (!userExist.data) {
      result.userNotFound = true;
    } else {
      const data = await OTP.createOTP(email, userExist._id);
      result.data = data;
    }
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.resetPassword = async (resetPasswordDTO, result = {}) => {
  try {
    const { OTP, email, newPassword, confirmPassword } = resetPasswordDTO;

    // Check if user exists
    const userExist = await empolyeesService.getProfile(email);
    if (!userExist.data) {
      result.isError = true;
      result.message = "User not found";
    }

    const OTPAvailable = await UserForgetPassword.findOne({ email });
    if (!OTPAvailable) {
      result.isError = true;
      result.message = "OTP not found";
    }

    if (OTPAvailable.otp !== OTP || OTPAvailable.expiresAt <= Date.now()) {
      result.isError = true;
      result.message = "Invalid or expired OTP";
    }
    const user = userExist.data;

    // Check if the new password matches the current password
    const isSamePassword = await user.comparePassword(newPassword);
    if (isSamePassword) {
      result.isError = true;
      result.message = "New password cannot be the same as the old password";
    }

    // Check if OTP is valid

    // Update user password
    user.password = newPassword;
    await user.save();

    // Clear OTP data
    OTPAvailable.otp = undefined;
    OTPAvailable.expiresAt = undefined;
    await OTPAvailable.save();

    // Success result

    result.data = { email };
  } catch (ex) {
    // Capture and store any errors
    result.ex = ex;
  } finally {
    // Return the result object regardless of success or error
    return result;
  }
};

exports.logout = async (logoutDto, result = {}) => {
  try {
    const { userId } = logoutDto;

    await redisClient.del(userId.toString());
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
