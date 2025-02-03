const Helper = require("../../Helper/helper");
const project = require("../../Models/project");
const users = require("../../Models/users");
const task = require("../../Models/task")

exports.createTask = async (req, res) => {
    const {       
        title,
        description,
        project_id,
        assign_id,
        user_id,
        priority,
        start_date,
        end_date,
        board,
    } = req.body;

    try {

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
            : assign_id.split(',').map((value) => BigInt(value.trim()));

            console.log("??",assign_id)

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
            task_title:title,
            task_description:description,
            project_id,
            assign_id: parsedAssignedMembers,
            priority,
            start_date,
            end_date,
            board_id:board,
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
    const { id } = req.body;
    try {

        const tasks = await task.findAll({
            where: {
                company_id: req.headers['x-id'],
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
        const company_id = req.headers['x-id'];

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