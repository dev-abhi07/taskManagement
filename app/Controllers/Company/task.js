const Helper = require("../../Helper/helper");
const project = require("../../Models/project");
const users = require("../../Models/users");
const task = require("../../Models/task");
const priority = require("../../Models/priority");
const board = require("../../Models/board");
const moment = require("moment");
const { Op } = require("sequelize");


exports.createTask = async (req, res) => {
    const companyId = req.user.company_id
    const {
      title,
      description,
      project_id,
      assign_id,
      priority,
      start_date,
      end_date,
      board,
    } = req.body;
  
    try {
      const user_id = req.user.id;
      if (!user_id) {
        return Helper.response("failed", "User ID is required", [], res, 200);
      }
  
      const user = await users.findOne({ where: { id: user_id } });
  
      if (!user) {
        return Helper.response("failed", "User not found", [], res, 200);
      }
  
      const projectData = await project.findOne({ where: { id: project_id } });
  
      if (!projectData) {
        return Helper.response("failed", "Project not found", [], res, 200);
      }
  
      const parsedAssignedMembers = Array.isArray(assign_id)
        ? assign_id.map((value) => BigInt(value))
        : assign_id.split(",").map((value) => BigInt(value.trim()));
  
      const projectTeamMembers = projectData.team_members.map((value) =>
        BigInt(value)
      );
  
      const invalidAssignees = [];
      console.log("Assigned Members:", parsedAssignedMembers.map(String)); 
  
      for (const member of parsedAssignedMembers) {
        if (!projectTeamMembers.includes(member)) {
          invalidAssignees.push(member.toString());
        }
      }
  
      console.log("Invalid Assignees:", invalidAssignees);
  
      if (invalidAssignees.length > 0) {
        return Helper.response(
          "failed",
          `Assign ID(s) ${invalidAssignees.join(", ")} not found in team members`,
          [],
          res,
          200
        );
      }
  
      const data = [
        {
          id: user.id,
          name: `${user.name} (Self)`,
        },
      ];
  
      const taskData = await task.create({
        company_id:companyId,
        user_id,
        task_title: title,
        task_description: description,
        project_id,
        assign_id: parsedAssignedMembers,
        priority,
        start_date,
        end_date,
        board_id: board,
        status: true,
      });
  
      if (taskData) {
        return Helper.response(
          "success",
          "Task created successfully",
          { taskData, assignedUsers: data },
          res,
          200
        );
      } else {
        return Helper.response("failed", "Failed to create task", [], res, 200);
      }
    } catch (error) {
      console.error("Error creating task:", error);
      return Helper.response("failed", error.message, [], res, 500);
    }
  };
  
exports.getTask = async (req, res) => {
    const { id } = req.body;
    const companyId = req.user.company_id;
    try {

        const tasks = await task.findAll({
            where: {
                company_id:companyId,
                id: id,
            }
        });

        if (!tasks) {
            return Helper.response("failed", "No tasks found", [], res, 200);
        }

        return Helper.response("success", "Tasks found", tasks, res, 200);
    }
    catch (error) {
        return Helper.response("failed", error, [], res, 500);
    }
}
exports.deleteTask = async (req, res) => {
    const { id } = req.body;
    try {

        if (!id) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }

        const taskDelete = await task.destroy({ where: { id: id } });

        if (taskDelete) {
            return Helper.response("success", "Task deleted successfully", taskDelete, res, 200);
        }
        else {
            return Helper.response("failed", "Failed to delete task", [], res, 200);
        }

    }
    catch (error) {
        return Helper.response("failed", error, [], res, 500);
    }
}

exports.updateTask = async (req, res) => {
    const { id, ...updateData } = req.body;

    try {
        const company_id = req.user.company_id;

        if (!id || !updateData) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }


        if (updateData.assign_id) {

            const parsedAssignedMembers = Array.isArray(updateData.assign_id)
                ? updateData.assign_id.map((value) => BigInt(value))
                : updateData.assign_id.split(',').map((value) => BigInt(value.trim()));


            const projectData = await project.findOne({ where: { id: updateData.project_id } });

            if (!projectData) {
                return Helper.response("failed", "Project not found", [], res, 200);
            }


            const invalidAssignees = [];

            for (const member of parsedAssignedMembers) {
                const isLead = await project.findOne({
                    where: { team_lead: member, id: updateData.project_id }
                });

                if (!isLead) {
                    invalidAssignees.push(member.toString());
                }
            }

            if (invalidAssignees.length > 0) {
                return Helper.response("failed", `Assign ID(s) ${invalidAssignees.join(', ')} not found as team leads`, [], res, 200);
            }


            updateData.assign_id = parsedAssignedMembers;
        }

        const updatedData = {
            created_by: req.headers['x-id'],
            ...updateData,
        };


        const [updatedTask] = await task.update(updateData, {
            where: {
                id: id,
                company_id: company_id
            }
        });

        if (updatedTask > 0) {
            const responseData = {
                ...updateData,
                assign_id: updateData.assign_id ? updateData.assign_id.map(String) : undefined,
            };

            return Helper.response("success", "Task updated successfully", responseData, res, 200);
        }

        return Helper.response("failed", "Failed to update task", [], res, 200);

    } catch (error) {
        console.error("Error updating task:", error);
        return Helper.response("failed", error.message, [], res, 500);
    }
};

exports.taskList = async(req,res)=>{
    const user_id = req.user.id
    const company_id = req.user.company_id
    try{
        const today = moment().startOf("day").toDate(); // Start of today (00:00:00)
        const tomorrow = moment().endOf("day").toDate();

        const tasks = await task.findAll({
            where: {
                [Op.or]: [
                    { user_id: user_id }, // Fetch tasks where the user is the creator
                    { assign_id: { [Op.contains]: [user_id] } } // Fetch tasks where the user is assigned
                ],
                createdAt: {
                    [Op.between]: [today, tomorrow] // Filters tasks created today
                }
            }
        });
       
        const taskData = tasks.map((item)=>item.toJSON())
        const data = await Promise.all(
            taskData.map(async(item)=>{
                let boardData;
                const employee = await users.findOne({
                    where:{id:req.user.id},
                    attributes:['name']
                })
                const projectName = await project.findOne({
                    where:{id:item.project_id},
                    attributes:['project_title']
                })

                const priorityData = await priority.findOne({
                    where: {id:item.priority},
                    attributes:['priority_name','color_code','id']
                })


                 boardData = await board.findOne({
                    where: {id:item.board_id},
                    attributes:['board_name','id','board_color']
                })
              
                

                return {
                    id:req.user.id,
                    employee:employee?.name,
                    project:projectName?.project_title,
                    task:item.task_title,
                    priority:{
                        label:priorityData?.priority_name,
                        value:priorityData?.id,
                        color_name:priorityData?.color_code

                    },
                    status:{
                        label:boardData ? boardData.board_name : null,
                        value:boardData ? boardData.id : null,
                        color:boardData ? boardData.board_color : null
                    },
                    start_date:await Helper.dateFormat(item.start_date),
                    end_date:await Helper.dateFormat(item.end_date),
                    description:item.task_description



                }
            })
        )
        if(!tasks){
            return Helper.response("failed", "No tasks found", [], res, 200);             
        }
        return Helper.response("success", "Tasks retrieved successfully",data, res, 200);

    }catch(err){
        return Helper.response("failed", err.message, [], res, 500);
    }
}



