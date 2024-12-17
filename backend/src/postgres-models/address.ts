import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import User from "./user";

class Address extends Model {}

Address.init(
    {
        addressId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: User,
                key: "userId",
            },
        },
    },
    {
        sequelize,
        schema: "user_management",
        modelName: "Address",
        tableName: "Addresses",
        timestamps: true,
    },
);
User.hasMany(Address, {
    foreignKey: "userId",
    as: "Addresses",
});
Address.belongsTo(User, {
    foreignKey: "userId",
    as: "User",
});
export default Address;
