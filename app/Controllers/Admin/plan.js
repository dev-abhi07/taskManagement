const { Op } = require("sequelize");
const Helper = require("../../Helper/helper");
const company = require("../../Models/company");
const plan = require("../../Models/plan");
const users = require("../../Models/users");


exports.planList = async (req, res) => {
    try {
        const plans = await plan.findAll({
            order:[
                ['id','ASC']
            ]
        });
        const planData = plans.map((item) => item.toJSON());
        const data = await Promise.all(planData.map(async (item) => {
            return {
                plan_id: item.id,
                title: item.plan_name,
                logo: item.plan_name,
                desc: item.plan_description,
                amount: item.price,
                userNumbers: item.max_users,
                tags: item.status,
                features: [
                    { feature: item.plan_type, available: true },
                ]


            }
        }))
        if (plans) {
            return Helper.response("success", "Plans found successfully", data, res, 200)
        } else {
            return Helper.response("failed", "No plans found", [], res, 200)
        }
    } catch (error) {
        return Helper.response("failed", error, [], res, 500)
    }

}

