import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const ExhibitionUser = db.define('ExhibitionUser',{ 
    PhoneNumber :{
        type:DataTypes.TEXT
    },
    Name: {
        type : DataTypes.TEXT
    },
   
    
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default ExhibitionUser;