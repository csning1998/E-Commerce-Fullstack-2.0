import { DataTypes, Model } from "sequelize";
import sequelize from "../db";
import User from "./user";

class CartItems extends Model {
    public id!: number;
    public title!: string;
    public productId!: string;
    public userId!: string;
    public amount!: number;
    public price!: number;
    public color!: string;
    public size!: string;
}

/*
// iPhone 20 Pro, 256G, red, charger?
// iPhone 20 Pro, 512G, blue
// iPhone 20 Pro, 1024G, black

options: [
    {
        name: 'color',
        values: ['red', 'green', 'blue'],
    },
    {
        name: 'size',
        values: ['256', '512', '1024'],
    },
    {
        name: 'note',
        values: ['charger'],
    }
]

=====

const calculateTotalPrice = (
        product: Products,
    ): { bestPrice: number; discountPrice: number } => {
        let bestPrice = product.basePrice;

        const options = selectedOptions.value[product.id] || {};

        product.options.forEach((option): void => {
            const selectedValue = options[option.name];
            const matchedValue = option.values.find(
                (value) => value.value === selectedValue,
            );

            if (matchedValue?.priceAdj) {
                bestPrice += matchedValue.priceAdj;
                discountPrice += matchedValue.priceAdj;
            }
        });

        return { bestPrice, discountPrice };
    };

*/

CartItems.init(
    {
        // id
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
            // primaryKey: true,
            // autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.INTEGER,
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
        modelName: "CartItem",
        tableName: "CartItems",
        timestamps: true,
    },
);

User.hasMany(CartItems, {
    foreignKey: "userId",
    as: "CartItems",
});
CartItems.belongsTo(User, {
    foreignKey: "userId",
    as: "User",
});

export default CartItems;
