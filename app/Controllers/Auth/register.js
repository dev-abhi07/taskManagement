const users = require("../../Models/users");
const company = require("../../Models/company");
const Helper = require("../../Helper/helper");
const { Op } = require("sequelize");

exports.companyRegister = async (req, res, next) => {
  try {
    const {
      company_name,
      email,
      contact_number,
      address,
      subscription_plan_id,
      subscription_start,
      subscription_end,
      fname,
      lname      
    } = req.body;


    const existingCompany = await company.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { contact_number: contact_number }
        ]
      }
    });

    if (existingCompany) {
      return Helper.response("failed", "Company already exists", {}, res, 200);
    }

    const user = await users.findOne({
      where: {
        [Op.or]: [
          { email: email },
          { mobile: contact_number }
        ]
      }
    })
    if (user) {
      return Helper.response("failed", "User already exists", {}, res, 200)
    }

    const companies = await company.create({
      fname:fname,
      lname:lname,
      company_name: company_name,
      email: email,
      contact_number: contact_number,
      address: address,
      subscription_plan_id: subscription_plan_id,
      subscription_start: subscription_start,
      subscription_end: subscription_end,
      created_by: 1
    });
    if (companies) {     
      const userEntry = await users.create({
        name: companies.company_name,
        company_id: companies.id,
        email: email,
        username: fname+lname,
        mobile: contact_number,
        role: "company",
        password: Helper.encryptPassword("123456"),
        created_by: 1
      });
      if (userEntry) {
        Helper.response("success", "Company Registered Successfully", { companies, user: userEntry }, res, 200)
      } else {
        Helper.response("failed", "Unable to create company", {}, res, 200)
      }
    } else {
      Helper.response("failed", "Database Error", {}, res, 200)
    }
  } catch (err) {
    Helper.response("failed", err.message, [], res, 200)
  }
};
