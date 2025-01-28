const { Op } = require("sequelize");
const Helper = require("../../Helper/helper");
const company = require("../../Models/company");
const plan = require("../../Models/plan");
const users = require("../../Models/users");


exports.planList = async (req, res) => {
    try{
        const plans = await plan.findAll();
        const planData = plans.map((item) => item.toJSON());
        const data = await Promise.all(planData.map(async (item) => {
            return{
                plan_id: item.id,
                title: item.plan_name,
                logo: item.plan_name,
                desc:item.plan_description,
                amount: "24.99",
                userNumbers: item.max_users,
                tags:item.status,
                features: [
                    {feature: item.plan_type,avlaible: true},
                ]


            }
        }))
        if(plans){
            return Helper.response("success", "Plans found successfully", data, res, 200)
        }else{
            return Helper.response("failed", "No plans found", [], res, 200)
        }
    }catch(error){
        return Helper.response("failed", error, [], res, 500)
    }

}

exports.demoPlan = async (req, res) => {
    const { plan_id, company_name, email, fname, lname, mobile} = req.body;
    try {
        if (!plan_id || !company_name || !email || !fname || !lname || !mobile ) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }

        // const existingCompany = await company.findOne({ where: { email: email } });
        // if (existingCompany) {
        //     return Helper.response("failed", "Company already exists", [], res, 200);
        // }

        const companies = await company.create({
            company_name: company_name,
            email: email,
            contact_number: mobile,
            address: "Demo Address",
            subscription_plan_id: plan_id,
            subscription_start: '',
            subscription_end: '',
            status: 1,
            created_by: 1
        });

        if (companies) {
            const user = await users.findOne({
                where: {
                    [Op.or]: [
                        { email: email },
                        { mobile: mobile }
                    ]
                }
            });
            if (user) {
                return Helper.response("failed", "User already exists", {}, res, 200);
            }

            const userEntry = await users.create({
                name: company_name,
                company_id: companies.id,
                email: email,
                username: fname + lname,
                mobile: companies.contact_number,
                role: 2,
                password: "123456",
                created_by: 1
            });

            if (!userEntry) {
                return Helper.response("failed", "Failed to create user", {}, res, 500);
            }
        }

        const planData = await plan.findOne({ where: { id: plan_id } });
        if (!planData) {
            return Helper.response("failed", "Plan not found", [], res, 200);
        }

        const data = {
            company_name: company_name,
            email: email,
            fname: fname,
            mobile: mobile,
            lname: lname,
            plan_id: planData.id,
            ...planData.toJSON()
        };

        return Helper.response("success", "Plan found successfully", data, res, 200);
    } catch (error) {
        console.error("Error in demoPlan:", error); // Log the error for debugging
        return Helper.response("failed", error.message, [], res, 500);
    }
};




