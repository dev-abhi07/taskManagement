


const Helper = require("../../Helper/helper");
const department = require("../../Models/department");
const designation = require("../../Models/designation");



exports.createDesignation = async (req, res) => {
    const { name, department_id, status } = req.body;
    

    try {
        const isExists = await designation.count({ where: { name:name } });
        if (isExists > 0) {
            return Helper.response("failed", name + " already exists", [], res, 200);
        }
        if (!name || !department_id || !req.headers['x-id']) {
            return Helper.response("failed", "Please provide all required fields", [], res, 200);
        }

      

        const designations = await designation.create({
            name: name.trim(),
            company_id: req.headers['x-id'],
            status: status,
            department_id: department_id,
            created_by: req.headers['x-id']
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

// exports.getDesignations = async (req, res) => {
   
//     const { id, department_id } = req.body;
//     try {
//         if (!department_id || !id) {
//             return Helper.response("failed", "Please provide all required fields", [], res, 200)
//         }
//         if (id && department_id) {
//             const designationsById = await designation.findOne({ where: { id: id } })
//             const departments = await department.findOne({ where: { id: department_id } })
//             if (!departments) {
//                 return Helper.response("failed", "No departments found", [], res, 200)
//             }
//             const departmentName = departments ? departments.name : null;
//             const data = {
//                 departmentName: departmentName,
//                 ...designationsById,
//             };
//             if (!designationsById) {
//                 return Helper.response("failed", "No designations found", [], res, 200)
//             }
//             return Helper.response("success", "Designations found", data, res, 200)
//         }
//     } catch (error) {
//         console.log(error)
//         return Helper.response("failed", error, [], res, 500)
//     }
// }

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
    const { id} = req.body;
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
      const designations = await designation.findAll();
  
      if (!designations) {
        return Helper.response(
          "failed",
          "Designations list not found",
          [],
          res,
          200
        );
      }
  
      const designationData = designations.map((data) => data.toJSON());
  
      const data = await Promise.all(
        designationData.map(async (item) => {
          const departments = await department.findOne({
            where: { id: item.department_id },
          });
          return {
            department_name: departments?.name,
            ...item,
          };
        })
      );
      return Helper.response("success", "Designations list", data, res, 200);
    } catch (err) {
      return Helper.response("failed", err, [], res, 500);
    }
};



  



