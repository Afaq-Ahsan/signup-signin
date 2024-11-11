const authRouter = require("./auth/auth.router");
const employeeRouter = require("./employees/employees.router");

exports.initRoute = (app) => {
  app.use("/auth", authRouter);
  app.use("/employees", employeeRouter);
};
