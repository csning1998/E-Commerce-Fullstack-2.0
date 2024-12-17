import express, { Router, Request, Response } from "express";
import { statusCodes } from "../lib/statusCodes";
import ProductModel from "../mongo-models/product";
import { HTTPJsonResponse } from "../lib/errorHandler";

/*
 * User can view and search products without login.
 * This route aims to retrieve all published merchandise (filtering by the state column).
 * Assume the only query strings we would receive is "Keyword"
 * */
const router: Router = express.Router();

router.get("/", async (req: Request, res: Response): Promise<void> => {
    const { keyword } = req.body;
    try {
        // https://www.mongodb.com/docs/manual/reference/operator/query/regex/
        // const query:
        //     | { name: { $regex: any; $options: string }; state: boolean }
        //     | { state: boolean } = keyword
        //     ? { state: true, name: { $regex: keyword, $options: "i" } }
        //     : { state: true };
        // const products: any = await ProductModel.find(query);

        const products = await ProductModel.find();

        res.json({
            //@ts-ignore
            payload: products.map((_) => {
                return _.toJSON({ virtuals: true });
            }),
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

router.get("/:id", async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
        const product: any = await ProductModel.findById(id);
        if (!product || !product.state) {
            return res
                .status(statusCodes.QUERYING.SUCCEED_UNPUBLISHED_PRODUCT.code)
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
});

export default router;
