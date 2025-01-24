const Helper = require("../../Helper/helper");
const company = require("../../Models/company");
const employee = require("../../Models/employee");
const users = require("../../Models/users");

exports.register = async (req, res) => {
  const { name, email, mobile,department_id,designation_id,reporting_to,role} = req.body;
  const company_id = req.headers["x-id"];
  try {
    const companyExists = await company.findOne({
      where: { company_id },
    });
    if (companyExists) {
      return res.status(200).json({ message: "Company not found" });
    }

    const user = await users.create({
      name: name,
      company_id:req.headers["x-id"],
      email: email,
      mobile: mobile,
      role:role,
      password: "123",
      created_by: req.headers["x-id"],
    });

    if (user) {
      const emp = await employee.create({
        user_id: user.id,
        company_id:req.headers["x-id"],
        name,
        email,
        reporting_to: reporting_to,
        department_id: department_id,
        designation_id: designation_id,
        created_by: req.headers["x-id"],
      });
      if (emp) {
        Helper.response('success', "Employee created successfully", emp, res, 200);
         
        };
      } else {
        Helper.response('failed', "Failed to create employee", [], res, 200);
      }
    }
   catch (err) {
    Helper.response('failed', err, [], res, 500);
  }
};



