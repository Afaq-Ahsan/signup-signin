const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const employeesSchema = new mongoose.Schema(
  {
    employeeName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

employeesSchema.pre("save", function (next) {
  var employee = this;

  if (!employee.isModified("password")) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(employee.password, salt, function (err, hash) {
      if (err) return next(err);

      employee.password = hash;

      next();
    });
  });
});

employeesSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const employees = mongoose.model("Employees", employeesSchema);

module.exports = employees;
