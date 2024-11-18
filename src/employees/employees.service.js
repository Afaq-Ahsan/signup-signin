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

exports.getEmployeeList = async (geEmployeeListsDto, result = {}) => {
  try {
    const { limit, offset } = geEmployeeListsDto;

    const [employee, count] = await Promise.all([
      Employees.find()
        .skip((offset - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Employees.countDocuments(),
    ]);
    result.data = {
      employee,
      count,
      pages: Math.ceil(count / limit),
    };
  } catch (ex) {
    result.ex = ex;
  } finally {
    return result;
  }
};
