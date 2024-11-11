const Employees = require("./employees.model");

exports.create = async (employeeDto, result = {}) => {
  try {
    result.data = await Employees.create(employeeDto);
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.getProfile = async (employeeEmail, result = {}) => {
  try {
    result.data = await Employees.findOne({ email: employeeEmail });
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};

exports.findById = async (userId, result = {}) => {
  try {
    result.data = await Employees.findById(userId);
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
