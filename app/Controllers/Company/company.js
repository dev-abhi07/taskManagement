const employee = require("../../Models/employee");
// const employees_hierarchy = require("../../Models/employees_hierarchy");
const department = require("../../Models/department");
const company = require("../../Models/company");
const Helper = require("../../Helper/helper");
const project = require("../../Models/project");

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

exports.createProject = async (req, res) => {
  const {
    project_title,
    project_description,
    start_date,
    end_date,
    team_members,
    team_lead,
  } = req.body;

  try {
    
    const parsedTeamMembers = Array.isArray(team_members)
      ? team_members.map((value) => BigInt(value)) 
      : team_members
          .split(',') 
          .map((value) => BigInt(value.trim()));

    
    const proj = await project.create({
      company_id: req.headers['x-id'],
      project_title, 
      project_description,
      start_date,
      end_date,
      team_members: parsedTeamMembers,
      team_lead,
      created_by: req.headers['x-id'],
      status:true,
    });

    if (proj) {
      Helper.response("success", "Project created successfully", proj, res, 200);
    } else {
      Helper.response("failed", "Failed to create project", [], res, 200);
    }
  } catch (err) {
    console.error("Error creating project:", err); 
    Helper.response("failed", err, [], res, 500);
  }
};

exports.getProject = async (req, res) =>{
  try {
    const projects = await project.findAll({
      where: {
        company_id: req.headers['x-id'],
      }
    });
    if (!projects) {
      return Helper.response("failed", "No projects found", [], res, 200);
    }
    return Helper.response("success", "Projects found", projects, res, 200);
  } catch (error) {
    console.log(error);
    return Helper.response("failed", error, [], res, 500);
  }
}

exports.updateProject = async (req, res) => {
  const { id, ...updateData } = req.body;

  try {
    const company_id = req.headers['x-id'];

    if (!id || !updateData) {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }

    
    if (updateData.team_members) {
      updateData.team_members = Array.isArray(updateData.team_members)
        ? updateData.team_members.map((value) => BigInt(value)) 
        : updateData.team_members
            .split(',') 
            .map((value) => BigInt(value.trim())); 
    }

    const updatedData = {
      created_by: req.headers['x-id'],
      ...updateData,
    };

    
    const [updatedCount] = await project.update(updatedData, {
      where: {
        id: id,
        company_id: company_id,
      },
    });

    if (updatedCount > 0) {
      const responseData = {
        ...updateData,
        team_members: updateData.team_members
          ? updateData.team_members.map(String)
          : undefined,
      };
      return Helper.response("success", "Project updated successfully", responseData, res, 200);
    } else {
      return Helper.response("failed", "Failed to update project", [], res, 200);
    }
  } catch (error) {
    return Helper.response("failed", error.message, [], res, 500);
  }
};

exports.deleteProject = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }
    const projectDelete = await project.destroy({ where: { id: id } });
    if (projectDelete) {
      return Helper.response("success", "Project deleted successfully", projectDelete, res, 200);
    } else {
      return Helper.response("failed", "Failed to delete project", [], res, 200);
    }
  } catch (error) {
    return Helper.response("failed", error, [], res, 500);
  }
}