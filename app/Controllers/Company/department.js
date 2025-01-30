

const Helper = require("../../Helper/helper");
const department = require("../../Models/department");
        
exports.createDepartment = async (req, res, next) => {
    const { name } = req.body;
    try {

        if (!name || !req.headers['x-id']) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200)
        }
        
        const isExists = await department.count({ where: { name: req.body.name,company_id:req.headers['x-id'] } });
        if (isExists > 0) {
            return Helper.response("failed", req.body.name + " already exists", [], res, 200)
        }
        const departments = await department.create({
            name: name.trim(),
            company_id: req.headers['x-id'],
            created_by: req.headers['x-id'],
            status: true
        });
        if (departments) {
            return Helper.response("success", "Department created successfully", departments, res, 200)
        } else {
            return Helper.response("failed", "Failed to create department", [], res, 200)
        }

    } catch (error) {
        return Helper.response("failed", error, [], res, 500)
    }

}

exports.getDepartments = async (req, res) => {
    const {id} = req.body;
    try {
        if (id) {
            const departmentsById = await department.findOne({ where: { id: id,company_id:req.headers['x-id']    } })
            if (!departmentsById) {
                return Helper.response("failed", "No departments found", [], res, 200)
            }
            return Helper.response("success", "Departments found", departmentsById, res, 200)
        }
        const departments = await department.findAll({
            where: {
                company_id: req.headers['x-id'],
            }
        })
        if (!departments) {
            return Helper.response("failed", "No departments found", [], res, 200)
        }
        return Helper.response("success", "Departments found", departments, res, 200)

    } catch (error) {
        console.log(error)
        return Helper.response("failed", error, [], res, 500)
    }
}

exports.updateDepartment = async (req, res) => {
    try {
        const { id } = req.body;
        const isExists = await department.count({ where: { name: req.body.name } });
        if (isExists < 0) {
            return Helper.response("failed", req.body.name + " already exists", [], res, 200)
        }
        const updateData = {
            name: req.body.name,
            company_id: req.headers['x-id'],
            created_by: req.headers['x-id'],
            status:req.body.status
        }
        if (!id || !updateData) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200)
        }
        const [updatedRows] = await department.update(updateData, { where: { id: id } })
        if (updatedRows === 0) {
            return Helper.response("failed", "Failed to update department", [], res, 200)
        }
        return Helper.response("success", "Department updated successfully", [], res, 200)


    } catch (error) {
        return Helper.response("failed", error, [], res, 500)
    }
}

exports.deleteDepartment = async (req, res) => {

    try {
        const { id } = req.body;
        const isExists = await department.count({ where: { id: id } });
        if (isExists < 0) {
            return Helper.response("failed", " Department not exists", [], res, 200)
        }
        if (!id) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200)
        }
        const departments = await department.destroy({ where: { id: id } })
        if (departments) {
            return Helper.response("success", "Department deleted successfully", departments, res, 200)
        } else {
            return Helper.response("failed", "Failed to delete department", [], res, 200)
        }
    } catch (err) {
        return Helper.response("failed", err, [], res, 500)
    }
}