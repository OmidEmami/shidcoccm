import { Sequelize } from "sequelize";
 
const db = new Sequelize('shidcoccm', 'root', '', {
    host: "localhost",
    dialect: "mysql"
});

export default db;

