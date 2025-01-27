const employee = require("../../Models/employee");
const employees_hierarchy = require("../../Models/employees_hierarchy");
const department = require("../../Models/department");
const company = require("../../Models/company");

exports.registerHierarchy = async (req, res) => {
  const { employee_id, manager_id, role_id, department_id } = req.body;
  try {
    const emp = await employee.findOne({
      where: { user_id: employee_id },
    });
    if (!emp) {
      return res.status(200).json({ message: "Employee not found" });
    }

    const dep = await department.findOne({
      where: { id: department_id },
    });
    if (!dep) {
      return res.status(200).json({ message: "Department not found" });
    }

   
    if (emp && dep) {
      const emp_hierarchy = await employees_hierarchy.create({
        employee_id: employee_id,
        manager_id: manager_id,
        role_id: role_id,
        department_id: department_id,
        created_by:employee_id
      });
      if (emp_hierarchy) {
        res.status(200).json({
          message: "Employee hierarchy created successfully",
          data: emp_hierarchy,
        });
      } else {
        res.status(200).json({
          message: "Failed to create employee hierarchy",
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
