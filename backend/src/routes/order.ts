import express, { NextFunction, Response, Router } from "express";
import { errorCreator, statusCodes } from "../lib/statusCodes";
import PGModels from "../postgres-models";
import ProductModel from "@/mongo-models/product";
import CartItems from "@/postgres-models/cart-items";

// https://www.postgresql.org/docs/current/datatype-json.html

interface Order {
    userId: number;
    items: OrderItems;
    totalAmount: number;
    buyerName: string;
    buyerContactPhone: string;
    recipient: string;
    shippingAddress: string;
    shippingContactPhone?: string;
    status?: string; //created, paymentConfirmed, shipping, delivered, canceled
    // createdAt: Date;
}

class OrderItems {
    public id!: number;
    public title!: string;
    public productId!: string;
    public userId!: string;
    public amount!: number;
    public price!: number;
    public color!: string;
    public size!: string;
}

const router: Router = express.Router();
router.post(
    "/",
    async (req: any, res: Response, next: NextFunction): Promise<void> => {
        const params = {
            ...req.body.order,
        };

        console.log("params", params);

        delete params.status;

        let totalAmount = 0;
        const orderParams = {
            ...params,
            // @ts-ignore
            items: params.items.map(async (item) => {
                // const product = await ProductModel.findById(item.id)
                console.log(item);
                const subtotal: number =
                    parseInt(item.price) * parseInt(item.amount);
                totalAmount += subtotal;

                return {
                    productId: item.productId,
                    title: item.title,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    amount: item.amount,
                    subtotal,
                };
            }),
        };

        orderParams.totalAmount = totalAmount;
        try {
            const order = await PGModels.Order.create(orderParams);
            res.json({
                payload: order,
                message: "Order created successfully",
            });
        } catch (error) {
            console.error(error);
            return next(error);
        }
    },
);

export default router;
