const { Op } = require("sequelize");
const Helper = require("../../Helper/helper");
const company = require("../../Models/company");
const companyStructure = require("../../Models/companyStructure");
const designation = require("../../Models/designation");
const employee = require("../../Models/employee");
const users = require("../../Models/users");
const department = require("../../Models/department");
const task = require("../../Models/task");



// exports.register = async (req, res) => {
//   const { fname, lname, email, mobile, department_id, designation_id } = req.body;
//   const company_id = req.headers["x-id"];
//   try {
//     const companyExists = await company.findOne({
//       where: { company_id },
//     });
//     if (!companyExists) {
//       return Helper.response('failed', 'company not found', [], res, 200);
//     }

//     const user = await users.findOne({
//       where: { company_id: company_id },
//     })

//     if (!user) {
//       return Helper.response('failed', 'users not found', [], res, 200);
//     }

//     const employeeData = await employee.findOne({
//       where: {
//         department_id: department_id,
//         designation_id: designation_id,
//       },
//       attributes: ['name']
//     })
//     const AddEmployee = await employee.create({
//       company_id: company_id,
//       user_id: user?.id,
//       name: `${fname.trim()} ${lname.trim()}`,
//       email: email.trim(),
//       mobile: mobile.trim(),
//       department_id: department_id.trim(),
//       designation_id: designation_id.trim(),
//       reporting_to: employeeData,
//       created_by: company_id,
//     })

//     if (!AddEmployee) {
//       return Helper.response('failed', "Employee not created", [], res, 200);
//     }
//     return Helper.response('success', "Employee created successfully", AddEmployee, res, 200);
//   }
//   catch (err) {
//     return Helper.response('failed', err, [], res, 500);
//   }
// }

exports.register = async (req, res) => {
  const { fname, lname, email, mobile, department, designation, report_to } = req.body;
  const company_id = req.headers["x-id"];
  try {

    const checkMobile = await users.count({
      where: {
        mobile: mobile
      }
    })

    if (checkMobile > 0) {
      return Helper.response('failed', "Mobile no already exists!", {}, res, 200);
    }

    const checkEmail = await users.count({
      where: {
        email: email
      }
    })

    if (checkEmail > 0) {
      return Helper.response('failed', "Email already exists!", {}, res, 200);
    }

    const user = await users.create({
      name: `${fname.trim()} ${lname.trim()}`,
      email: email,
      mobile: mobile,
      password: Helper.encryptPassword("123456"),
      company_id: company_id,
      created_by: company_id,
      role: "employee",
      username: `${fname.trim()}${lname.trim()}`
    })

    if (user) {
      const createEmployee = await employee.create({
        company_id: company_id,
        user_id: user.id,
        name: `${fname.trim()} ${lname.trim()}`,
        email: email,
        department_id: department,
        designation_id: designation,
        reporting_to: report_to,
        created_by: company_id,
      })
      return Helper.response('success', "Employee created successfully!", { userData: user, employeeData: createEmployee }, res, 200);
    }
  }
  catch (err) {
    console.log(err)
    return Helper.response('failed', err, [], res, 500);
  }
};

exports.departmentDesignationBasedEmployee = async (req, res) => {
  const { department_id } = req.body;
  try {
    if (!department_id) {
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
          label: item?.name,
          value: item?.id,
        };
      })
    );
    return Helper.response('success', "designation found successfully", data, res, 200);

  } catch (err) {
    return Helper.response('failed', err, [], res, 500);
  }
}


exports.getReportDepartmentAndDesignation = async (req, res) => {
  const { department_id, designation_id } = req.body;
  try {
    if (!department_id || !designation_id) {
      return Helper.response('failed', "Please provide department Id and designation Id", [], res, 200);
    }

    // Fetch employees based on department_id and designation_id by Varun
    const levels = await designation.findOne({
      where: {
        department_id: department_id,
        company_id: req.headers['x-id'],
        id: designation_id
      },
    });

    const upperLevels = await companyStructure.findAll({
      where: {
        level: {
          [Op.lt]: levels.level
        },
        company_id: req.headers['x-id']
      },
      order: [["level", "ASC"]],
    });

    const data = []
    upperLevels.map((t) => {
      const values = {
        value: t.id,
        label: t.name
      }
      data.push(values)
    })

    return Helper.response('success', 'Data found successfully', data, res, 200);
  } catch (err) {
    // Handle errors
    return Helper.response('failed', err.message || 'Internal Server Error', [], res, 500);
  }
};

exports.employeeList = async (req, res) => {
  try {
      const companyId = req.headers['x-id'];

      const employeeLists = await employee.findAll({
          where: { company_id: companyId }
      });

      if (!employeeLists || employeeLists.length === 0) {
          return Helper.response('failed', "No employee found", [], res, 200);
      }

      const employeeData = employeeLists.map(item => item.toJSON());

      const data = await Promise.all(employeeData.map(async (item) => {
          const departments = await department.findOne({
              where: { id: item.department_id },
              attributes: ['name','id']
          });

          const designations = await designation.findOne({
              where: { id: item.designation_id },
              attributes: ['name','id','level']
          });

          let reports = null; 

          const levelId = parseInt(designations?.level, 10);
          if (!isNaN(levelId)) {
              reports = await companyStructure.findOne({
                  where: { id: levelId },
                  attributes: ['id', 'name']
              });
          
          } else {
              console.log('Error: Invalid level ID:', designations?.level);
          }
          
          const user = await users.findOne({
              where: { id: item.user_id },
              attributes: ['mobile','role']
          });

          const companies = await company.findOne({
              where: { id: item.company_id },
              attributes: ['address']
          });





          const [first_name, ...last_nameArr] = item.name.split(' ');
          const last_name = last_nameArr.join(' ');

          const last_login = new Date().toLocaleString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

          return {
               first_name: first_name,
               last_name: last_name,
              employee_id:item?.user_id,
              displayName: item?.name,
              phone: user?.mobile,
              address: companies?.address,
              designation_name: designations?.name,
              department_name: departments?.name,
              email: item.email,
              role:user?.role,
              department_id:departments?.id,
              designation_id:designations?.id,
              last_login:last_login,
              reporting_to:reports?.name
             
          };
      }));

      return Helper.response('success', 'Data found successfully', data, res, 200);

  } catch (err) {
      return Helper.response('failed', err.message || 'Internal Server Error', [], res, 500);
  }
};


exports.employeeDashboard=async(req,res)=>{
    try{
       
      console.log('varun')
      
      

    }catch(err){
      console.log(err.message)

    }
} 
