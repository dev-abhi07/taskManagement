const users = require("../../Models/users");
const company = require("../../Models/company");
const Helper = require("../../Helper/helper");

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
      status,
      username,
    } = req.body;

    
    const companies = await company.create({
      company_name: company_name,
      email: email,
      contact_number: contact_number,
      address: address,
      subscription_plan_id: subscription_plan_id,
      subscription_start: subscription_start,
      subscription_end: subscription_end,
      status: status,
      created_by:1
    });
    if (companies) {
      const userEntry = await users.create({
        name: companies.company_name,
        company_id: companies.id,
        email: email,
        username: username,
        mobile: companies.contact_number,
        role: 2,
        password: "1234",
        created_by:1
      });
      if (userEntry) {
        Helper.response("success", "Company Registered Successfully", {companies, user: userEntry}, res, 200)       
      } else {
        Helper.response("failed", "Unable to create company", {}, res, 200)
      }
    } else {
      Helper.response("failed", "Database Error", {}, res, 500)
    }
  } catch (err) {
    Helper.response("failed", "Database Error", err, res, 500)
  }
};
