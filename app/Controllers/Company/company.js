const employee = require("../../Models/employee");
const department = require("../../Models/department");
const company = require("../../Models/company");
const companyStructure = require("../../Models/companyStructure");
const Helper = require("../../Helper/helper");

exports.createCompanyStructure = async (req, res) => {
  try {
    const { name, level } = req.body;
    const company_id = req.headers['x-id']
    const created_by = req.headers['x-id']
    if (!name || !level) {
      Helper.response("failed", "All fields are required", {}, res, 200)
    }

    const existingLevel = await companyStructure.findOne({
      where: { company_id, level },
    });

    if (existingLevel) {
      Helper.response("failed", "This level already exists for the company.", {}, res, 200)
    }

    // Insert into database
    const newLevel = await companyStructure.create({
      company_id,
      name,
      level,
      created_by,
    });
    Helper.response("success", "Company level created successfully.", { data: newLevel }, res, 200)
  } catch (error) {
    console.log(error)
    Helper.response("failed", "Server not responding", error, res, 200)
  }
};

exports.getAllCompanyLevels = async (req, res) => {
  try {
    const levels = await companyStructure.findAll({
      where: {
        company_id: req.headers['x-id']
      },
      order: [
        ['level', 'ASC']
      ]
    });
    Helper.response("success", "Record Found!", levels, res, 200)
  } catch (error) {
    console.error("Error fetching company levels:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateCompanyStructure = async (req, res) => {
  try {
    const { name, level, id } = req.body;
    const created_by = req.headers['x-id']
    const levelRecord = await companyStructure.findByPk(id);
    if (!levelRecord) {
      Helper.response("failed", "Record not found!", {}, res, 200)
    }

    await levelRecord.update({ name, level, created_by });

    Helper.response("success", "Company level updated successfully.", { levelRecord }, res, 200)
  } catch (error) {
    console.error("Error updating company level:", error);
    Helper.response("failed", "Server not responding.", {}, res, 200)
  }
}

exports.deleteCompanyStructure = async (req, res) => {
  try {
    const { id } = req.body;

    const levelRecord = await companyStructure.findByPk(id);
    if (!levelRecord) {
      Helper.response("failed", "Record not found!", {}, res, 200)
    }

    await levelRecord.destroy();
    Helper.response("success", "Company Deleted successfully.", {}, res, 200)
  } catch (error) {
    console.error("Error deleting company level:", error);
    Helper.response("failed", "Server not responding.", {}, res, 200)
  }
};

exports.companyLevels = async (req, res) => {
  try {
    const levels = await companyStructure.findAll({
      where: {
        company_id: req.headers['x-id']
      },
      order: [
        ['name', 'ASC']
      ]
    });

    const data = []
    levels.map((t) => {
      const values = {
        value: t.id,
        label: t.name
      }
      data.push(values)
    })
    Helper.response("success", "", data, res, 200)
  } catch (error) {
    console.error(error);
    Helper.response("failed", "Server not responding.", {}, res, 200)
  }
}