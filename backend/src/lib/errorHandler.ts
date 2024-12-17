import { Express, NextFunction, Request, Response } from "express";
import type { ErrorRequestHandler } from "express";

// const app: Express = express();
// app.use(errorHandler);

export const HTTPJsonResponse: any = function (
    res: Response,
    status: any,
    payload: any,
): Response<any, Record<string, any>> {
    return res.status(status).json({
        payload,
        ...status,
    });
};

export const HTTPJsonUserErrorResponse: any = function (
    res: Response,
    error: Error,
    statusCode = 400,
): Response<any, Record<string, any>> {
    return res.status(statusCode).json({
        message: error.message,
    });
};

module.exports = function (app: Express): void {
    const errorHandler: ErrorRequestHandler = (
        err: any,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void => {
        console.error(err);
        res.status(err.status || 500);

        if (app.get("env") === "development") {
            app.locals.pretty = true;
            res.json({
                payload: err.message,
            });
        } else {
            res.json({
                payload: "Server error",
            });
        }
    };

    app.use(errorHandler);
};
