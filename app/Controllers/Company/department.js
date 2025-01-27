
const Helper = require("../../Helper/helper");
const department = require("../../Models/department");




exports.createDepartment = async (req, res,next) => {
    const {name,company_id} = req.body;

    try{
        if(!name || !company_id){
            return Helper.response(false,"Please provide all required fields",[],res,200)
        }
        const departments = await department.create({
            name:name,
            company_id:company_id,
            created_by:1,
            status:true
        });
        if(departments){
            return Helper.response(true,"Department created successfully",departments,res,200)
        }else{
            return Helper.response(false,"Failed to create department",[],res,200)
        }

    }catch(error){
        return Helper.response(false,error,[],res,500)
        
    }

}

exports.getDepartments = async (req, res) => {
    const {id} = req.body;

    try{
        if(id){
           const departmentsById = await department.findOne({where:{id:id}})
           if(!departmentsById){
               return Helper.response(false,"No departments found",[],res,200)
           }
              return Helper.response(true,"Departments found",departmentsById,res,200)
        }
        const departments = await department.findAll({})
        if(!departments){
            return Helper.response(false,"No departments found",[],res,200)
        }

        return Helper.response(true,"Departments found",departments,res,200)

    }catch(error){
        console.log(error)
        return Helper.response(false,error,[],res,500)
    }
}

exports.updateDepartment = async (req,res) => {
    try{
        const {id,...updateData} = req.body;
        if(!id || !updateData){
            return Helper.response(false,"Please provide all required fields",[],res,200)
        }
        const [updatedRows] = await department.update(updateData,{where:{id:id}})
        if(updatedRows === 0){
            return Helper.response(false,"Failed to update department",[],res,200)
        }
        return Helper.response(true,"Department updated successfully",[],res,200)


    }catch(error){
        return Helper.response(false,error,[],res,500)
    }
}

exports.deleteDepartment = async (req, res) => {
    try{
        const {id} = req.body;
        if(!id){
            return Helper.response(false,"Please provide all required fields",[],res,200)
        }
        const departments = await department.destroy({where:{id:id}})
        if(departments){
            return Helper.response(true,"Department deleted successfully",departments,res,200)
        }else{
            return Helper.response(false,"Failed to delete department",[],res,200)
        }
    }catch(err){
        return Helper.response(false,err,[],res,500)
    }
}