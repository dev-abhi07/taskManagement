const Helper = require("../../../Helper/helper");
const designation = require("../../Models/designation");



exports.createDesignation = async (req, res) => {
    const { name} = req.body;
    const comapany_id = req.headers['x-id'];
    try {
        if(!name){
            return Helper.response("failed","Please provide all required fields",[],res,200)
        }
        const designations = await designation.create({
            name: name,
            company_id: comapany_id,
            status: true,
            created_by: 1
        });
        if (designations) {
            return Helper.response("success", "Designation created successfully", designations, res, 200)
        } else {
            return Helper.response("failed", "Failed to create designation", [], res, 200)
        }
    }catch(error){
        return Helper.response("failed",error,[],res,500)
    }
}

exports.getDesignations = async (req, res) => {
    const {id} = req.body;
    try{
        if(id){
            const designationsById = await designation.findOne({where:{id:id}})
            if(!designationsById){
                return Helper.response("failed","No designations found",[],res,200)
            }
            return Helper.response("success","Designations found",designationsById,res,200)
        }
        const designations = await designation.findAll({})
        if(!designations){
            return Helper.response("failed","No designations found",[],res,200)
        }
        return Helper.response("success","Designations found",designations,res,200)
    }catch(error){
        console.log(error)
        return Helper.response("failed",error,[],res,500)
    }
}

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

exports.deleteDesignation = async (req,res) => {
    const {id} = req.body;
    try{
        if(!id){
            return Helper.response("failed","Please provide all required fields",[],res,200)
        }
        const designationDelete = await designation.destroy({where:{id:id}})
        if(designationDelete){
            return Helper.response("success","Designation deleted successfully",designationDelete,res,200)
        }else{
            return Helper.response("failed","Failed to delete designation",[],res,200)
        }
    }catch(error){
        return Helper.response("success",error,[],res,500)
    }
}





