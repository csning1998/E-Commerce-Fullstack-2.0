import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import PGModels from "../postgres-models";
import { statusCodes } from "./statusCodes";
import User from "../postgres-models/user";

/*
  * In the jsonwebtoken package, the function definition for jwt.sign looks like this (simplified version):
    * sign(payload: string | object | Buffer, secretOrPrivateKey: Secret, options?: SignOptions): string;
    * sign(payload: string | object | Buffer, secretOrPrivateKey: null, options: { algorithm: "none" }): string;
  * When the value of process.env.JWT_SECRET is undefined:
    * TypeScript cannot treat undefined as a valid Secret.
    * It also cannot treat undefined as the null conforming to the second overload. Therefore, neither overload
        matches, resulting in a "No overload matches this call" error.
  * Adding an if statement allows the TypeScript compiler to ensure that when you execute jwt.sign,
    process.env.JWT_SECRET is always a valid string (or other type conforming to Secret).
  *

  By using this library, we can remove every process.env.JWT_SECRET in the project
*/

// Ensure JWT_SECRET exists
if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET is not defined in the environment variables.");

    // Also can break the application startup process by throwing an error.
    // throw new Error("JWT_SECRET is not defined in the environment variables")
}

const SECRET_KEY: Secret = process.env.JWT_SECRET || "DEFAULT_SECRET";

export const verity: any = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<any> => {
    try {
        // const { userId, userName } = req.body;
        let token = req.headers.token as string | undefined;

        if (!token) {
            token = <string>req.query.token;
        }

        console.log("token", token);

        if (!token) {
            return next(
                new Error(statusCodes.AUTHENTICATION.NO_TOKEN_PROVIDED.message),
            );
        }

        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;

        console.log("decoded.userId", decoded.userId);

        if (decoded.userId) {
            const currentUser: User | null = await PGModels.User.findOne({
                where: {
                    userId: decoded.userId,
                },
            });

            if (currentUser) {
                req.currentUser = currentUser;
                return next();
            } else {
                return next(
                    new Error(
                        statusCodes.AUTHENTICATION.USER_NOT_FOUND.message,
                    ),
                );
            }
        } else {
            return next(
                new Error(statusCodes.AUTHENTICATION.INVALID_TOKEN.message),
            );
        }
    } catch (error) {
        console.error("JWT verification failed:", error);
        return next(
            new Error(
                statusCodes.AUTHENTICATION.JWT_VERIFICATION_FAILED.message,
            ),
        );
    }
};

export const create: (payload: any) => String = function (
    payload: any,
): String {
    return jwt.sign(payload, SECRET_KEY, {
        expiresIn: "12h",
    });
};
