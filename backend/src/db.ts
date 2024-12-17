import { Sequelize } from "sequelize";

export default new Sequelize({
    dialect: "postgres",
    host: "postgres",
    database: process.env.POSTGRES_DB || "e-commerce",
    username: process.env.POSTGRES_USER || "e-commerce-dev",
    password: process.env.POSTGRES_PASSWORD || "e-commerce-password",
});
