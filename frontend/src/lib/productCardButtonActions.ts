import { type Ref, ref, type UnwrapRef } from "vue";
import request from "@/stores/request";

interface AddToCartParams {
    title: string;
    productId: number;
    amount: number;
    price: number;
    color: string | number;
    size: string | number;
}

export function productCardButtonActions(userId?: string): {
    quantities: Ref<Record<string, number>>;
    addToCart: (params: AddToCartParams) => Promise<void>;
    addToFavorites: (product: CartItem) => Promise<void>;
} {
    const quantities: Ref<UnwrapRef<Record<string, number>>> = ref<
        Record<string, number>
    >({});

    const addToCart = async (params: AddToCartParams): Promise<void> => {
        const { productId, amount, price, color, size, title } = params;

        console.log("params", params);

        if (!amount || amount <= 0) {
            alert("Please select a valid quantity.");
            return;
        }

        if (!color || !size) {
            alert("Please select all product options (color and size).");
            return;
        }

        try {
            await request.put("/carts", {
                cartItems: [
                    {
                        productId: productId,
                        title: title,
                        amount: amount,
                        price: price,
                        color: color,
                        size: size,
                    },
                ],
            });
            alert("Added to cart");
        } catch (error: any) {
            alert("Failed to add to cart.");
            console.error(error);
        }
    };

    const addToFavorites = async (product: CartItem): Promise<void> => {
        try {
            await request.post("/favorites", {
                productId: product._id,
            });
            alert("Added to favorites");
        } catch (error) {
            alert("Failed to add to favorites.");
            console.error(error);
        }
    };

    return {
        quantities,
        addToCart,
        addToFavorites,
    };
}
