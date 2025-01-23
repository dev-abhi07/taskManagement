import employee from "../../Models/employee";
import company from "../../Models/company";
import users from "../../Models/users";

exports.register = async (req, res) => {
  const { company_id, name, email } = req.body;
  try {

    const companyExists = await company.findOne({
        where:{ company_id },
    })
    if(companyExists){
        return res.status(404).json({message:"Company not found"});
    }

    const user = await users.findOne({
        where : { company_id }
    })
    if(!user){
        return res.status(404).json({message:"User not found"});
    }

    const userExists = await employee.findOne({
      where: { email: email },
    });
    if (userExists) {
      return res.status(404).json({ message: "Email already registered" });
    }

    const emp = await employee.create({
      user_id:user.id,
      company_id,
      name,
      email,
      department_id: 0,
      designation_id: 0,
    });

    if (emp) {
      res.status(200).json({
        message: "Employee created successfully",
        data: emp,
      });
    } else {
      res.status(400).json({
        message: "Failed to create employee",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
