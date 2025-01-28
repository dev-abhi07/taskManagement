const Helper = require("../../Helper/helper");
const company = require("../../Models/company");
const designation = require("../../Models/designation");
const employee = require("../../Models/employee");
const users = require("../../Models/users");


exports.register = async (req, res) => {
  const { fname,lname, email, mobile,department_id,designation_id,reporting_to} = req.body;
  const company_id = req.headers["x-id"];
  try {
    const companyExists = await company.findOne({
      where: { company_id },
    });
    if (!companyExists) {
      return Helper.response('failed','comapny not found',[],res,200);
    }

    const user = await users.findOne({
      where: {company_id:company_id},
    })
    
    if(!user){
      return Helper.response('failed','users not found',[],res,200);
    }

    const AddEmployee = await employee.create({
      company_id:company_id,
      user_id:user?.id,
      name: `${fname.trim()} ${lname.trim()}`,
      email: email.trim(),
      mobile: mobile.trim(),
      department_id:department_id.trim(),
      designation_id:designation_id.trim(),
      reporting_to:reporting_to.trim(),
      created_by:company_id,
    })

    if(!AddEmployee){
      return Helper.response('failed',"Employee not created",[],res,200);
    }
    return Helper.response('success',"Employee created successfully",AddEmployee,res,200);

    // const user = await users.create({
    //   name: name,
    //   company_id:req.headers["x-id"],
    //   email: email,
    //   mobile: mobile,
    //   role:role,
    //   password: "123",
    //   created_by: req.headers["x-id"],
    // });

    // if (user) {
    //   const emp = await employee.create({
    //     user_id: user.id,
    //     company_id:req.headers["x-id"],
    //     name,
    //     email,
    //     reporting_to: reporting_to,
    //     department_id: department_id,
    //     designation_id: designation_id,
    //     created_by: req.headers["x-id"],
    //   });
    //   if (emp) {
    //     Helper.response('success', "Employee created successfully", emp, res, 200);
         
    //     };
    //   } else {
    //     Helper.response('failed', "Failed to create employee", [], res, 200);
    //   }
    }
   catch (err) {
    return Helper.response('failed', err, [], res, 500);
  }
};

exports.departmenetDesignationBasedEmployee = async (req, res) => {
  const { department_id} = req.body;
   try{
    if(!department_id){
      return Helper.response('failed', "Please provide department Id", [], res, 200);
    }
     const designations = await designation.findAll({
      where: {
        department_id: department_id,
      }
     })
     const designationData = designations.map((item) => item.toJSON());
     const data = await Promise.all(
       designationData.map(async (item) => {
         return {
           name: item?.name,
           value: item?.id,
         };
       })
     );
    return Helper.response('success', "designation found successfully", data, res, 200);

   }catch(err){
   return  Helper.response('failed', err, [], res, 500);
   }
}
