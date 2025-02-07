const Helper = require("../../Helper/helper");
const priority = require('../../Models/priority')

exports.createPriority = async (req, res) => {
    const { priority_name, color_name } = req.body;

    try {
        const priorityData = await priority.create({
            company_id: req.headers['x-id'],
            priority_name:priority_name,
            color_code: color_name,
            created_by: req.headers['x-id'],
            status: true,
        });

        if (priorityData) {
            return Helper.response("success", "Priority created successfully", priorityData, res, 200);
        }
        else {
            return Helper.response("failed", "Failed to create priority", [], res, 200);
        }
    }
    catch (error) {
        return Helper.response("failed", error, [], res, 500);
    }
}

exports.getPriority = async (req, res) => {
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
        const priorityDelete = await priority.destroy({ where: { id: id,company_id:1 } });
        if (priorityDelete) {
            return Helper.response("success", "Priority deleted successfully",[], res, 200);
        } else {
            return Helper.response("failed", "Failed to delete priority", [], res, 200);
        }
    } catch (error) {
        return Helper.response("failed", error, [], res, 500);
    }
}

exports.updatePriority = async (req, res) => {
    const {id} = req.body;

    try {
        const company_id = req.headers['x-id'];

        if (!id) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);

        }

        const updateData ={
            priority_name:req.body.priority_name,
            color_code:req.body.color_name,
            created_by:req.body.created_by,
            status:req.body.status,
            created_by:company_id
        }

        const updatedPriority = await priority.update(updateData,
            {
                where:
                {
                    id: id,
                    company_id: company_id
                }
            });

        if (updatedPriority) {
            return Helper.response("success", "Priority updated successfully", [], res, 200);
        }

        return Helper.response("failed", "Failed to update priority", [], res, 200);
    }
    catch (error) {
        return Helper.response("failed", error.message, [], res, 500);
    }
}

exports.prioritiesDropDown = async(req,res)=>{
    const companyId = req.user.company_id
    try{
        const priorities = await priority.findAll({
            where: {
              company_id: companyId
            }
          })
          const priorityData = priorities.map((item) => item.toJSON());
         
          const data = await Promise.all(
            priorityData.map(async (item) => {
              return {
                label: item?.priority_name,
                value: item?.id,
                created_at:item?.created_by,
                color_name:item?.color_code,
    
              };
            })
          );
          if(!priorities){
            return Helper.response("failed", "No data found", [], res, 200);
          }

          return Helper.response('success','data found successfully',data,res,200)


    }catch(err){
        return Helper.response("failed", err.message, [], res, 500);
    }
}

