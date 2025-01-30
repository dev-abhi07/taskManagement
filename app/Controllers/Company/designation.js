const Helper = require("../../Helper/helper");
const companyStructure = require("../../Models/companyStructure");
const department = require("../../Models/department");
const designation = require("../../Models/designation");

exports.createDesignation = async (req, res) => {
    const { name, department_id,level_id } = req.body;

    try {
        const isExists = await designation.count({ where: { name: name, level:level_id,company_id: req.headers['x-id'] } });
        if (isExists > 0) {
            return Helper.response("failed", name + " already exists", [], res, 200);
        }
        if (!name || !department_id || !req.headers['x-id']) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }



        const designations = await designation.create({
            name: req.body.name.trim(),
            company_id: req.headers['x-id'],
            department_id: department_id,
            created_by: req.headers['x-id'],
            level:level_id
        });

        if (designations) {
            return Helper.response("success", "Designation created successfully", designations, res, 200);
        } else {
            return Helper.response("failed", "Failed to create designation", [], res, 200);
        }
    } catch (error) {
        console.error("Error in createDesignation:", error); // Log the error for debugging
        return Helper.response("failed", error.message, [], res, 500);
    }
};
exports.updateDesignation = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const createdBy = req.headers['x-id'];
        const company_id = req.headers['x-id'];

        updateData.created_by = createdBy;

        if (!id || !updateData) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }
        const updatedDesignation = await designation.update(updateData, { where: { id: id, company_id: company_id } });
        if (updatedDesignation) {
            return Helper.response("success", "Designation updated successfully", updatedDesignation, res, 200);
        }

        return Helper.response("failed", "Failed to update designation", [], res, 200);

    } catch (error) {
        return Helper.response("failed", error, [], res, 500);
    }
};

exports.deleteDesignation = async (req, res) => {
    const { id } = req.body;
    try {
        if (!id) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200)
        }
        const designationDelete = await designation.destroy({ where: { id: id } })
        if (designationDelete) {
            return Helper.response("success", "Designation deleted successfully", designationDelete, res, 200)
        } else {
            return Helper.response("failed", "Failed to delete designation", [], res, 200)
        }
    } catch (error) {
        return Helper.response("failed", error, [], res, 500)
    }
}


exports.designationsList = async (req, res) => {
    try {
        const designations = await designation.findAll({
            where: { company_id: req.headers['x-id'] },
        });

        if (!designations) {
            return Helper.response(
                "failed",
                "Designations list not found",
                [],
                res,
                200
            );
        }

        //console.log(designations,255)
        const data = []
        await Promise.all(designations.map(async(t) => {
            const departments = await department.findOne({
                where: { id: t.department_id , company_id: req.headers['x-id']},
            });
            const level = await companyStructure.findOne({
                where:{
                    id:t.level,
                    company_id: req.headers['x-id']
                }
            })           
            const values = {
                ...t.dataValues,
                department_name:departments.name,
                level_name:level?.name,
                level_id:level?.id
            }
            
            data.push(values)
        }))
        return Helper.response("success", "Designations list", data, res, 200);
    } catch (err) {
        return Helper.response("failed", err, [], res, 500);
    }
};