const employee = require("../../Models/employee");
// const employees_hierarchy = require("../../Models/employees_hierarchy");
const department = require("../../Models/department");
const company = require("../../Models/company");
const Helper = require("../../Helper/helper");
const project = require("../../Models/project");
const priority = require("../../Models/priority");
const task = require("../../Models/task");
const users = require("../../Models/users");
const board = require("../../Models/board");

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

exports.createPriority = async (req, res) => {
  const { priority_name, color_code} = req.body;

  try {
    const priorityData = await priority.create({
      company_id: req.headers['x-id'],
      priority_name,
      color_code: color_code,
      created_by: req.headers['x-id'],
      status: true,
    });

    if (priorityData) 
    {
      return Helper.response("success", "Priority created successfully", priorityData, res, 200);
    } 
    else 
    {
      return Helper.response("failed", "Failed to create priority", [], res, 200);
    }
  } 
  catch (error) 
  {
    return Helper.response("failed", error, [], res, 500);
  }
} 

exports.getPriotity = async (req, res) => {
  const { id } = req.body;
  try {
    const priorities = await priority.findAll({
      where: {
        company_id: req.headers['x-id'],
      }
    });
    if (!priorities) {
      return Helper.response("failed", "No priorities found", [], res, 200);
    }
    return Helper.response("success", "Priorities found", priorities, res, 200);
  } catch (error) {
    return Helper.response("failed", error, [], res, 500);
  }
}

exports.deletePriority = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }
    const priorityDelete = await priority.destroy({ where: { id: id } });
    if (priorityDelete) {
      return Helper.response("success", "Priority deleted successfully", priorityDelete, res, 200);
    } else {
      return Helper.response("failed", "Failed to delete priority", [], res, 200);
    }
  } catch (error) {
    return Helper.response("failed", error, [], res, 500);
  }
}

exports.updatePriority = async(req, res) =>{
  const { id, ...updateData } = req.body;

  try {
    const company_id = req.headers['x-id'];
    updateData.created_by = req.headers['x-id'];

    if (!id || !updateData) 
    {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }

    const updatedPriority = await priority.update(updateData, 
      { where: 
        { 
          id: id, 
          company_id: company_id 
        } 
      });

    if (updatedPriority) 
    {
      return Helper.response("success", "Priority updated successfully", updatedPriority, res, 200);
    }

    return Helper.response("failed", "Failed to update priority", [], res, 200);
  } 
  catch (error) 
  {
    return Helper.response("failed", error, [], res, 500);
  }
}

exports.createTask = async (req, res) => {
  const { 
    user_id,
    task_title,
    task_description,
    project_id,
    assign_id,
    priority,
    due_date,
    board_id,
  } = req.body;

  try {
    
    if (!user_id) {
      return Helper.response("failed", "User ID is required", [], res, 200);
    }

    
    const user = await users.findOne({ where: { id: user_id } });

    if (!user) {
      return Helper.response("failed", "User not found", [], res, 200);
    }

    // const boardData = await board.findOne(
    //   { where: 
    //     { id: board_id} 
    //   }); 
    
    //   if(!boardData)
    //   {
    //     return Helper.response("failed", "Board not found", [], res, 200);
    //   }
    
    const projectData = await project.findOne({ where: { id: project_id } });

    if (!projectData) {
      return Helper.response("failed", "Project not found", [], res, 200);
    }

    
    const parsedAssignedMembers = Array.isArray(assign_id)
      ? assign_id.map((value) => BigInt(value))
      : assign_id.split(',').map((value) => BigInt(value.trim()));

    
    const invalidAssignees = [];

    for (const member of parsedAssignedMembers) {
      const isLead = await project.findOne({ where: { team_lead: member, id: project_id } });

      if (!isLead) {
        invalidAssignees.push(member.toString());
      }
    }

    if (invalidAssignees.length > 0) {
      return Helper.response("failed", `Assign ID(s) ${invalidAssignees.join(', ')} not found as team leads`, [], res, 200);
    }

    
    const data = [
      {
        id: user.id,
        name: `${user.name} (Self)`, 
      },
    ];

    
    const taskData = await task.create({
      company_id: req.headers['x-id'],
      user_id,
      task_title,
      task_description,
      project_id,
      assign_id: parsedAssignedMembers,
      priority,
      due_date,
      board_id:1,
      status: true,
    });

    if (taskData) {
      return Helper.response("success", "Task created successfully", { taskData, assignedUsers: data }, res, 200);
    } else {
      return Helper.response("failed", "Failed to create task", [], res, 200);
    }
  } catch (error) {
    console.error("Error creating task:", error);
    return Helper.response("failed", error.message, [], res, 500);
  }
};

exports.getTask = async (req, res) => {
  const {id} = req.body;
  try {

    const tasks = await task.findAll({
      where: {
        company_id: req.headers['x-id'],
        id:id,
      }
    });

    if (!tasks) {
      return Helper.response("failed", "No tasks found", [], res, 200);
    }

    return Helper.response("success", "Tasks found", tasks, res, 200);
  } 
  catch (error) 
  {
    return Helper.response("failed", error, [], res, 500);
  }
}
exports.deleteTask = async(req, res) =>{
  const { id } = req.body;
  try {

    if (!id) 
    {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }

    const taskDelete = await task.destroy({ where: { id: id } });

    if (taskDelete) 
    {
      return Helper.response("success", "Task deleted successfully", taskDelete, res, 200);
    } 
    else 
    {
      return Helper.response("failed", "Failed to delete task", [], res, 200);
    }

  } 
  catch (error) 
  {
    return Helper.response("failed", error, [], res, 500);
  }
}

exports.updateTask = async(req, res) =>{
  const { id, ...updateData } = req.body;

  try {
    const company_id = req.headers['x-id'];

    if (!id || !updateData) 
    {
      return Helper.response("failed", "Please provide all required fields", [], res, 200);
    }

    if (updateData.assign_id) {
      updateData.assign_id = Array.isArray(updateData.assign_id)
        ? updateData.assign_id.map((value) => BigInt(value)) 
        : updateData.assign_id
            .split(',') 
            .map((value) => BigInt(value.trim())); 
    }

    const updatedData = {
      created_by: req.headers['x-id'],
      ...updateData,
    };

    const [updatedTask] = await task.update(updateData, 
      { where: 
        { 
          id: id, 
          company_id: company_id 
        } 
      });

      if (updatedTask > 0) {
        const responseData = {
          ...updateData,
          assign_id: updateData.assign_id
            ? updateData.assign_id.map(String)
            : undefined,
        };

    if (updatedTask) 
    {
      return Helper.response("success", "Task updated successfully", responseData, res, 200);
    }

    return Helper.response("failed", "Failed to update task", [], res, 200);
  } 
}
  catch (error) 
  {
    return Helper.response("failed", error.message, [], res, 500);
  }
}