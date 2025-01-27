const { Op } = require("sequelize");
const department = require("../../Models/department");
const jwt = require("jsonwebtoken");
const Helper = require("../../Helper/helper");
const users = require("../../Models/users");
const jwt = require("jsonwebtoken");
const Helper = require("../../Helper/helper");


exports.login = async (req, res) => {
  const data = req.body;
  const user = await users.findOne({
    where: {
      [Op.or]: [{ username: req.body.login_id }, { email: req.body.login_id }],
    },
  });

  if (!user) {
    Helper.response("success", "User not exists!", {}, res, 200);
  }

  if (data.password === Helper.decryptPassword(user.password)) {
    let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "2h",
    });

    const updateToken = await user.update(
      { auth_key: token },
      {
        where: {
          [Op.or]: [
            { username: req.body.login_id },
            { email: req.body.login_id },
          ],
        },
      }
    );
    if (updateToken) {
      Helper.response(
        "success",
        "Logged In Successfully!",
        { userData: user },
        res,
        200
      );
    }
  } else {
    Helper.response(
      "success",
      "Login Id or Password is invalid!",
      {},
      res,
      200
    );
  }
};

