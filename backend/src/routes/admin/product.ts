import express, {
    Express,
    Request,
    Response,
    NextFunction,
    Router,
} from "express";
import { statusCodes } from "../../lib/statusCodes";
import { HTTPJsonResponse } from "../../lib/errorHandler";
import mongoose from "mongoose";
import Product from "../../mongo-models/product";

const router: Router = express.Router();

router.get("/products", async (req: Request, res: Response): Promise<void> => {
    const { keyword } = req.body;
    try {
        // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
        // const query:
        //     | { name: { $regex: any; $options: string }; state: boolean }
        //     | { state: boolean } = keyword
        //     ? { state: true, name: { $regex: keyword, $options: "i" } }
        //     : { state: true };

        let query = {};
        let products: any = [];

        // @ts-ignore
        if (req.currentUser.userPermission !== "admin") {
            query = {
                // @ts-ignore
                supplierID: req.currentUser.id,
            };
        }

        products = await Product.find(query);

        res.json({
            payload: products,
        });

        // HTTPJsonResponse(res, statusCodes.QUERYING.SUCCEED_BULK.code, {
        //     products,
        // });
    } catch (err) {
        console.error(err);
        res.status(statusCodes.BACKEND_LOGIC.code).json({
            ...statusCodes.BACKEND_LOGIC,
        });
    }
});

router.get(
    "products/:id",
    async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        try {
            const product: any = await Product.findById(id);
            if (!product || !product.state) {
                return res
                    .status(
                        statusCodes.QUERYING.SUCCEED_UNPUBLISHED_PRODUCT.code,
                    )
                    .json({
                        ...statusCodes.QUERYING.SUCCEED_UNPUBLISHED_PRODUCT,
                    });
            }
            return HTTPJsonResponse(
                res,
                statusCodes.QUERYING.SUCCEED_UNPUBLISHED_PRODUCT,
                product,
            );
        } catch (error) {
            return HTTPJsonResponse(res, statusCodes.BACKEND_LOGIC, error);
        }
    },
);

// const Product = mongoose.model("Product");

router.post("/products", async (req: Request, res: Response): Promise<any> => {
    try {
        const { productName, description, price, state } = req.body;

        if (!productName || !price || !state) {
            res.json({ message: "Product name is required" });
        }

        const newProduct = new Product({ ...req.body });

        await newProduct.save();

        res.status(200).json(newProduct);
    } catch (error) {
        // return HTTPJsonResponse(res, statusCodes.BACKEND_LOGIC.code, error);
        console.log(error);
    }
});

router.put(
    "/products/:id",
    async (req: Request, res: Response): Promise<any> => {
        try {
            const updates: any = req.body;
            const { id } = req.params;
            console.log("===============================");
            console.log("id", id);
            if (!id) {
                return res.json({ message: "Product name is required" });
            }

            const updatedProduct: any = await Product.updateOne(
                { _id: id },
                updates,
                { new: true },
            );

            console.log("===============================");
            console.log("updatedProduct", updatedProduct);

            // await updatedProduct?.save()

            res.status(200).json(updatedProduct);
        } catch (error) {
            console.log(error);
        }
    },
);

router.delete(
    "/products/:id",
    async (req: Request, res: Response): Promise<any> => {
        const { id } = req.params;
        try {
            await Product.findByIdAndDelete(id);

            res.json({
                message: "The product has been deleted.",
            });
        } catch (error) {
            console.log(error);
        }
    },
);

export default router;
