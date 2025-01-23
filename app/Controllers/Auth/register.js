const users = require("../../Models/users");
const company = require("../../Models/company");
exports.companyRegister = async (req, res, next) => {


    console.log(req.body,25)
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
        res.status(200).json({
          status: 200,
          message: "Company and user registered successfully",
          data: { companies, user: userEntry },
        });
      } else {
        res.status(200).json({
          status: 500,
          message: "Failed to register user",
          data: null,
        });
      }
    } else {
      res.status(200).json({
        status: 500,
        message: "Failed to register company",
        data: null,
      })
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};
