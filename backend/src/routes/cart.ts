import express, { NextFunction, Response, Router } from "express";
import { errorCreator, statusCodes } from "../lib/statusCodes";
import PGModels from "../postgres-models";
import CartItems from "@/postgres-models/cart-items";

/*
 * User can view and search products without login.
 * This route aims to retrieve all published merchandise (filtering by the state column).
 * Assume the only query strings we would receive is "Keyword"
 * */

function establishingCart(cartItems: CartItems[]): {
    items: {
        productId: string;
        color: string;
        size: string;
        price: number;
        amount: number;
        subtotal: number;
    }[];
    baseAmount: number;
    discount: number;
    totalAmount: number;
} {
    let baseAmount: number = 0;
    let discount: number = 0;

    // The price calculation feature is retained to allow for future implementation of discounts or promotional offers.

    return {
        items: cartItems.map(
            (
                item: CartItems,
            ): {
                productId: string;
                title: string;
                color: string;
                size: string;
                price: number;
                amount: number;
                subtotal: number;
            } => {
                const subtotal: number = item.price * item.amount;
                baseAmount += subtotal;
                return {
                    productId: item.productId,
                    title: item.title,
                    color: item.color,
                    size: item.size,
                    price: item.price,
                    amount: item.amount,
                    subtotal,
                };
            },
        ),
        baseAmount,
        discount,
        totalAmount: baseAmount * (1 - discount),
    };
}

const router: Router = express.Router();
router.get(
    "/",
    async (req: any, res: Response, next: NextFunction): Promise<void> => {
        try {
            const cartItems: CartItems[] = await PGModels.CartItems.findAll({
                where: { userId: req.currentUser.userId },
            });

            console.log("cartItems", cartItems);

            const cart: {
                items: {
                    productId: any;
                    price: any;
                    amount: any;
                    subtotal: number;
                }[];
                baseAmount: number;
                discount: number;
                totalAmount: number;
            } = establishingCart(cartItems);

            console.log("cart", cart);

            res.json({
                payload: cart,
            });
        } catch (err) {
            console.error(err);
            return next(errorCreator(statusCodes.BACKEND_LOGIC));
        }
    },
);

router.put(
    "/",
    async (req: any, res: Response, next: NextFunction): Promise<any> => {
        try {
            if (!req.body.cartItems || !Array.isArray(req.body.cartItems)) {
                return res
                    .status(400)
                    .json({ error: "Missing or invalid cartItems" });
            }

            console.log("cartItems", req.body);

            const promises: Promise<CartItems>[] = req.body.cartItems.map(
                async (item: any): Promise<CartItems> => {
                    const { productId, amount, price, color, size, title } =
                        item;

                    if (!productId || !amount || !price || !color || !size) {
                        return Promise.reject(
                            new Error("Missing required fields in cartItem"),
                        );
                    }

                    const [instance, created] =
                        await PGModels.CartItems.findOrCreate({
                            where: {
                                productId: productId.toString(),
                                userId: req.currentUser.userId,
                                color: color,
                                size: size.toString(),
                            },
                            defaults: {
                                productId: productId.toString(),
                                title: title,
                                amount: amount,
                                price: price.toString(),
                                color: color,
                                size: size.toString(),
                                userId: req.currentUser.userId,
                            },
                        });
                    if (!created) {
                        const newAmount: any = instance.amount + amount;
                        await instance.update({
                            amount: newAmount,
                            price: price,
                        });
                    }
                    return instance;
                },
            );

            const updatedItems: CartItems[] = await Promise.all(promises);

            const cart: {
                items: {
                    productId: any;
                    color: string;
                    size: string;
                    price: any;
                    amount: any;
                    subtotal: number;
                }[];
                baseAmount: number;
                discount: number;
                totalAmount: number;
            } = establishingCart(updatedItems);

            res.json({
                payload: cart,
            });
        } catch (error) {
            console.error(error);
            return next(errorCreator(statusCodes.BACKEND_LOGIC));
        }
    },
);

router.put(
    "/:id",
    async (req: any, res: Response, next: NextFunction): Promise<any> => {
        try {
            const cartItemId: any = req.params.id;
            const { productId, amount, price } = req.body;

            // Validate input data
            if (!productId || !amount || !price) {
                return res
                    .status(400)
                    .json({ error: "Missing required fields" });
            }

            // Find the cart item by ID
            const cartItem: CartItems | null = await PGModels.CartItems.findOne(
                {
                    where: {
                        id: cartItemId,
                        userId: req.currentUser.userId,
                    },
                },
            );

            if (!cartItem) {
                return res.status(404).json({ error: "Cart item not found" });
            }

            // Update the cart item with new data
            await cartItem.update({
                productId,
                amount,
                price,
            });

            // Recalculate the cart
            const cartItems: CartItems[] = await PGModels.CartItems.findAll({
                where: { userId: req.currentUser.userId },
            });

            const cart: {
                items: {
                    productId: any;
                    price: any;
                    amount: any;
                    subtotal: number;
                }[];
                baseAmount: number;
                discount: number;
                totalAmount: number;
            } = establishingCart(cartItems);

            res.json({
                payload: cart,
            });
        } catch (error) {
            console.error(error);
            return next(errorCreator(statusCodes.BACKEND_LOGIC));
        }
    },
);

export default router;
