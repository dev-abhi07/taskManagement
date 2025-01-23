const company = require("../../Models/company");
const users = require("../../Models/users");
const { createUser } = require("../Admin/users");

exports.Register = async(req,res,next)=>{
  try{
    const {company_name,email,contact_number,address,subscription_plan_id,subscription_start,subscription_end,status,username} = req.body
    const company = await company.create({
        company_name:company_name,
        email:email,
        contact_number:contact_number,
        address:address,
        subscription_plan_id:subscription_plan_id,
        subscription_start:subscription_start,
        subscription_end:subscription_end,
        status:status,
      
    })
    if(company){
        const userEntry = await users.create({
            name:company.company_name,
            company_id:company.id,
            email:email,
            username:username,
            mobile:company.contact_number,
            role:'company',
            password:"1234"
        });
        if(userEntry) {
            res.status(200).json({
                status:200,
                message:"Company and user registered successfully",
                data:{ company, user: userEntry }
            })
        } else {
            res.status(500).json({
                status:500,
                message:"Failed to register user",
                data:null
            })
        }
    }else{
        res.status(500).json({
            status:500,
            message:"Failed to register company",
            data:null
        })
    }

  }catch(err){
    console.log(err)
    next(err)
  }
}