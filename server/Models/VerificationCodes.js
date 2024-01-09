import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const VerificationCodes = db.define('VerificationCodes',{ 
    PhoneNumber :{
        type:DataTypes.TEXT
    },
    VerifyCode: {
        type : DataTypes.TEXT
    },
    isExpired:{
        type: DataTypes.TEXT,
    },
    
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default VerificationCodes;