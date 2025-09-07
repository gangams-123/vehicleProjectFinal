import { Dialect, Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DB_HOST);
console.log(process.env.DB_PASSWORD);
const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT as Dialect
});

export default sequelize;
