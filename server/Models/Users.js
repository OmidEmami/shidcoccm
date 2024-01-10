import { Sequelize } from "sequelize";
import db from "../Config/Database.js";

 
const { DataTypes } = Sequelize;
 
const Users = db.define('Users',{ 
    FullName :{
        type:DataTypes.TEXT
    },
    Email: {
        type : DataTypes.TEXT
    },
    Password:{
        type: DataTypes.TEXT,
    },
    Phone:{
        type:DataTypes.TEXT
    },
    Rule:{
        type :DataTypes.TEXT
    },
    IsConfirmed:{
        type: DataTypes.TEXT
    },
    Province:{
        type: DataTypes.TEXT
    },
    Address:{
        type: DataTypes.TEXT
    },
    RefreshToken:{
        type: DataTypes.TEXT
    }
    
    
},{
    freezeTableName:true
});
 
(async () => {
    await db.sync();
})();
export default Users;