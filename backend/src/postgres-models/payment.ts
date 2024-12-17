import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import User from "./user";

class Payment extends Model {}

Payment.init(
    {
        paymentId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        cardNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isCreditCard: true,
            },
        },
        cardHolderName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expirationDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        cvv: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [3, 4],
            },
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
        modelName: "Payment",
        tableName: "Payments",
        timestamps: true,
    },
);

User.hasMany(Payment, {
    foreignKey: "userId",
    as: "Payments",
});
Payment.belongsTo(User, {
    foreignKey: "userId",
    as: "User",
});

export default Payment;
