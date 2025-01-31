const users = require("../../Models/users");
const company = require("../../Models/company");
const Helper = require("../../Helper/helper");
const { Op } = require("sequelize");
const moment = require("moment/moment");
const plan = require('../../Models/plan')
const payment = require('../../Models/payment')

exports.companyRegister = async (req, res, next) => {
  try {
    const {
      company_name,
      email,
      mobile,
      subscription_plan_id,
      fname,
      lname,
    } = req.body;

    const today = moment();
    let subscription_start = today.format("YYYY-MM-DD HH:mm:ss");
    let subscription_end;

    const existingCompany = await company.findOne({
      where: {
        [Op.or]: [{ email: email }, { contact_number: mobile }],
      },
    });

    if (existingCompany) {
      return Helper.response("failed", "Company already exists", {}, res, 200);
    }

    const user = await users.findOne({
      where: {
        [Op.or]: [{ email: email }, { mobile: mobile }],
      },
    });
    if (user) {
      return Helper.response("failed", "User already exists", {}, res, 200);
    }

    const selectedPlan = await plan.findOne({
      where: { id: subscription_plan_id },
    });

    if (!selectedPlan) {
      return Helper.response("failed", "Invalid plan", {}, res, 200);
    }

    const planUsageCount = await company.count({
      where: { subscription_plan_id },
    });

    if (planUsageCount >= selectedPlan.max_users) {
      return Helper.response(
        "failed",
        "Plan user limit reached. Cannot register new company.",
        {},
        res,
        400
      );
    }

    if (selectedPlan.trial_period > 0) {
      subscription_end = today
        .add(selectedPlan.trial_period, "days")
        .format("YYYY-MM-DD HH:mm:ss");
    } else {
      switch (selectedPlan?.plan_name) {
        case "monthly plan":
          subscription_end = today
            .add(1, "months")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "quarterly plan":
          subscription_end = today
            .add(3, "months")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "yearly plan":
          subscription_end = today
            .add(1, "years")
            .format("YYYY-MM-DD HH:mm:ss");
          break;
        case "free plan":
          subscription_end = today.add(7, "days").format("YYYY-MM-DD HH:mm:ss");
          break;
        default:
          return Helper.response("failed", "Invalid plan type", {}, res, 200);
      }
    }

    const companyRecord = await company.create({
      fname: fname,
      lname: lname,
      company_name: company_name,
      email: email,
      contact_number: mobile,
      address: "street123",
      subscription_plan_id: subscription_plan_id,
      subscription_start: subscription_start,
      subscription_end: subscription_end,
      created_by: 1,
    });

    const userEntry = await users.create({
      name: company_name,
      company_id: companyRecord.id,
      email: email,
      username: fname + lname,
      mobile: mobile,
      role: "company",
      password: Helper.encryptPassword("123456"),
    });

    const amountToCharge = selectedPlan?.price || 0.0;

    const transactionId = `#${Date.now()}`;

    await payment.create({
      subscriber_id: companyRecord.id,
      subscription_plan_id: subscription_plan_id,
      transaction_id: transactionId,
      amount: amountToCharge,
      payment_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      payment_method: "upi",
      payment_status: "success",
    });

    Helper.response(
      "success",
      "Company Registered Successfully",
      { company: companyRecord, user: userEntry },
      res,
      200
    );
  } catch (err) {
    console.log(err);
    Helper.response("failed", err.message, [], res, 200);
  }
};
