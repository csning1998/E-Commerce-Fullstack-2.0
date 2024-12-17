import { DataTypes, Model } from "sequelize";
import sequelize from "../db";

class Order extends Model {
    public id!: number;
    public items!: string;
    public totalAmount!: number;
    public buyerName!: string;
    public buyerContact!: string;
    public recipient!: string;
    public buyerContactPhone!: string;
    public shippingAddress!: string;
    public shippingContact?: string;
    public shippingContactPhone?: string;
    public status?: string; //created, paymentConfirmed, shipping, delivered, canceled
}

Order.init(
    {
        // id: {
        //     type: DataTypes.STRING,
        //     allowNull: true,
        // },
        items: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        totalAmount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        buyerName: {
            type: DataTypes.STRING,
            // allowNull: true,
        },
        // buyerContact: {
        //     type: DataTypes.STRING,
        //     // allowNull: true,
        // },
        buyerContactNumber: {
            type: DataTypes.STRING,
            // allowNull: true,
        },
        recipient: {
            type: DataTypes.STRING,
        },
        shippingAddress: {
            type: DataTypes.STRING,
            // allowNull: true,
        },
        // shippingContact: {
        //     type: DataTypes.STRING,
        //     // allowNull: false,
        // },
        shippingContactPhone: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            // allowNull: false,
        },
    },
    {
        sequelize,
        schema: "order_management",
        modelName: "Order",
        tableName: "Orders",
        timestamps: true,
    },
);

export default Order;
