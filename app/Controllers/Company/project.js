const Helper = require("../../Helper/helper");
const department = require("../../Models/department");
const project = require('../../Models/project')
const employee = require('../../Models/employee');
const { Op } = require("sequelize");
const users = require("../../Models/users");



exports.createProject = async (req, res) => {
    const {
        project_title,
        project_description,
        start_date,
        deadline,
        department_id,
        team,
        team_lead_id,
    } = req.body;



    try {
        const dep = await department.findOne({
            where: { id: department_id, company_id: req.headers['x-id'] }
        })

        const parsedTeamMembers = Array.isArray(team)
            ? team.map((value) => BigInt(value))
            : team
                .split(',')
                .map((value) => BigInt(value.trim()));

        const parsedTeamLead = BigInt(team_lead_id); // Ensure team_lead is BigInt

        const proj = await project.create({
            company_id: req.headers['x-id'],
            project_title,
            project_description,
            department_id,
            start_date,
            end_date: deadline,
            team_members: parsedTeamMembers,
            team_lead: parsedTeamLead,
            created_by: req.headers['x-id'],
            status: true,
        });

        if (proj) {
            // Convert BigInt values to Strings before sending response
            const responseData = {
                ...proj.get({ plain: true }), // Convert Sequelize object to plain object
                team_members: parsedTeamMembers.map((id) => id.toString()),
                team_lead: parsedTeamLead.toString()
            };

            return Helper.response("success", "Project created successfully", responseData, res, 200);
        } else {
            return Helper.response("failed", "Failed to create project", [], res, 200);
        }
    } catch (err) {
        console.error("Error creating project:", err);
        Helper.response("failed", err, [], res, 500);
    }
};

exports.getProject = async (req, res) => {
    try {
        const projects = await project.findAll({
            where: {
                company_id: req.headers['x-id'],
            }
        });

        const data = []
        await Promise.all(projects.map(async (t) => {

            const departments = await department.findOne({
                where: {
                    id: t.department_id,
                    status: true
                }
            })

            const user = await users.findAll({
                where: {
                    id: { [Op.in]: t.team_members }
                }
            })

            const teamLead = await users.findByPk(t.team_lead)
            const empData = []
            user.map((record) => {
                const values = {
                    value: record.id,
                    label: record.name
                }
                empData.push(values)
            })


            const dataValues = {
                title: t.project_title,
                description: t.project_description,
                team_lead: teamLead.name,
                id: t.id,
                deadline: await Helper.dateFormat(t.end_date),
                department_id: departments.id,
                start_date: await Helper.dateFormat(t.start_date),
                department_name: departments.name,
                team: empData,
                team_lead_id: t.team_lead,
                iso_start:t.start_date,
                iso_end:t.end_date,
                status: t.status == true ? "Active" : "InActive"
            }
            data.push(dataValues)
        }))
        if (!data) {
            return Helper.response("failed", "No projects found", [], res, 200);
        }
        return Helper.response("success", "Projects found", data, res, 200);
    } catch (error) {
        console.log(error);
        return Helper.response("failed", error, [], res, 500);
    }
}

exports.updateProject = async (req, res) => {
    const { id, deadline,...updateData } = req.body;

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
            end_date:deadline,
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


