const sequelize = require("../Connection/sequelize");
const plan = require("../Models/plan");










const synchronize = sequelize.sync({alter:true}).then(()=>{
    console.log('All table connected');
    
   }).catch((err)=>{
   console.log(err.message);
   
   })
   
module.exports = synchronize