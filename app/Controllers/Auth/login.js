const { Op } = require("sequelize");
const department = require("../../Models/department");
const jwt = require("jsonwebtoken");
const Helper = require("../../Helper/helper");
const users = require("../../Models/users");



exports.login = async (req, res) => {
  try {
    const data = req.body;
  

    if(!data.login_id || !data.password){
      return Helper.response("failed", "Please provide all required fields", {}, res, 200);
    }



    const user = await users.findOne({
      where: {
        [Op.or]: [{ username: req.body.login_id }, { email: req.body.login_id }],
      },
    });
    // console.log('user',user.password)
    // console.log('data',data.password)

    if (!user) {
      return Helper.response("failed", "User not exists!", {}, res, 200);
    }
    if (data.password === user.password) {
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
        return Helper.response(
          "success",
          "Logged In Successfully!",
          { userData: user },
          res,
          200
        );
      }
    } else {
      return Helper.response(
        "failed",
        "Login Id or Password is invalid!",
        {},
        res,
        200
      );
    }
  } catch (error) {
    return Helper.response("failed", "An error occurred!", { error: error.message }, res, 500);
  }
};

