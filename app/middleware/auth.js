const Helper = require("../Helper/helper")


exports.authenticate = async(req,res,next)=>{
    try{
        const authHeader =
        req.headers["authorization"] || req.headers["Authorization"];
      const token = authHeader && authHeader.split(" ")[1];
      if(token){
        const decoded = await Helper.verifyToken(token);
        console.log("decoded", decoded);
        req.user = decoded;
        next();
      }

    }catch(err){
        return Helper.response('failed',err.message,[],res,200)
    }
}

exports.Employee = async(req,res,next)=>{
      try{
        if (req.user.role !== "employee") {
            return Helper.response(
              "failed",
              "You are not an employee",
              [],
              res,
              200
            );
          }
          next();
      }catch(err){
        return Helper.response('failed',err.message,[],res,200)
      }
}