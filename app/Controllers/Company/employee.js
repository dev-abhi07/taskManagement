const company = require("../../Models/company");
const employee = require("../../Models/employee");
const users = require("../../Models/users");

exports.register = async (req, res) => {
  const { company_id, name, email, mobile } = req.body;
  try {
    const companyExists = await company.findOne({
      where: { company_id },
    });
    if (companyExists) {
      return res.status(200).json({ message: "Company not found" });
    }

    const user = await users.create({
      name: name,
      company_id: company_id,
      email: email,
      mobile: mobile,
      role: 2,
      password: "123",
      created_by: company_id,
    });

    if (user) {
      const emp = await employee.create({
        user_id: user.id,
        company_id,
        name,
        email,
        department_id: 0,
        designation_id: 0,
      });
      if (emp) {
        res.status(200).json({
          message: "Employee created successfully",
          data: user,
        });
      } else {
        res.status(200).json({
          message: "Failed to create employee",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
