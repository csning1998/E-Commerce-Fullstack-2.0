import express, {
    Express,
    Request,
    Response,
    NextFunction,
    Router,
} from "express";

// import Order from "@/postgres-models/order";
import PGModels from "../../postgres-models";

const router: Router = express.Router();

router.get(
    "/orders",
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            let orders: any = [];

            // @ts-ignore
            if (req.currentUser.userPermission !== "admin") {
                next(new Error("You do not have permission to"));
            }

            orders = await PGModels.Order.findAll();

            res.json({
                payload: orders,
            });
        } catch (err) {
            return next(err);
        }
    },
);

export default router;
