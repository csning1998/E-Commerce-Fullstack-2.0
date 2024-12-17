import { Response } from "express";
export const statusCodes = {
    LOGIN: {
        SUCCESS: {
            code: 200,
            status: "success",
            message: "(200) Successfully logged in",
        },
        INVALID_CREDENTIALS: {
            code: 401,
            status: "error",
            message: "(401) Invalid username or password.",
        },
        USER_NOT_FOUND: {
            code: 404,
            status: "error",
            message: "(404) User not found.",
        },
        USERNAME_OR_PASSWORD_NULL: {
            code: 409,
            status: "error",
            message: "(409) Either username or password cannot be null.",
        },
        SERVER_CONFIGURATION_ERROR: {
            code: 500,
            status: "error",
            message: "(500) Server configuration error.",
        },
        LOGIN_FAILED: {
            code: 500,
            status: "error",
            message: "(500) Login failed.",
        },
    },
    REGISTRATION: {
        SUCCESS: {
            code: 200,
            status: "success",
            message: "(200) Successfully registered",
        },
        PASSWORD_MISMATCH: {
            code: 400,
            status: "error",
            message: "(400) Mismatched confirm password.",
        },
        EMAIL_ALREADY_REGISTERED: {
            code: 409,
            status: "error",
            message: "(409) Email has already been registered.",
        },
        REGISTRATION_FAILED: {
            code: 500,
            status: "error",
            message: "(500) Registration failed.",
        },
    },
    SESSION: {
        RETRIEVED_SESSION: {
            code: 200,
            status: "success",
            message: "(200) Successfully retrieved session data.",
        },
        INQUIRY_FAILED: {
            code: 500,
            status: "error",
            message: "(500) Failed to process inquiry.",
        },
    },
    USER_UPDATE: {
        SUCCESS: {
            code: 200,
            status: "success",
            message: "(200) User information has successfully updated.",
        },
        FAILED: {
            code: 400,
            status: "error",
            message: "(400) User update failed.",
        },
    },
    AUTHENTICATION: {
        NO_TOKEN_PROVIDED: {
            code: 401,
            status: "error",
            message: "(401) No token provided.",
        },
        INVALID_TOKEN: {
            code: 401,
            status: "error",
            message: "(401) Invalid token.",
        },
        USER_NOT_FOUND: {
            code: 404,
            status: "error",
            message: "(404) User not found for token.",
        },
        JWT_SECRET_NOT_DEFINED: {
            code: 500,
            status: "error",
            message:
                "(500) Server configuration error: JWT_SECRET is not defined.",
        },
        JWT_VERIFICATION_FAILED: {
            code: 500,
            status: "error",
            message: "(500) Failed to process JWT verification.",
        },
    },
    QUERYING: {
        SUCCEED_BULK: {
            code: 200,
            status: "success",
            message: "(200) Successfully queried.",
        },

        SUCCEED_UNPUBLISHED_PRODUCT: {
            code: 204,
            status: "success",
            message: "(204) Product is unpublished or does not exist.",
        },
        SUCCEED_INSERTED: {
            code: 200,
            status: "success",
            message: "(200) The product has successfully added.",
        },
        SUCCEED_UPDATED: {
            code: 200,
            status: "success",
            message: "(200) The product has successfully updated.",
        },
        SUCCEED_DELETED: {
            code: 200,
            status: "success",
            message: "(200) The product has successfully deleted.",
        },
        MISSING_FIELD: {
            code: 404,
            status: "error",
            message: "(404) Required fields are missing.",
        },
        UPDATE_FAILED: {
            code: 404,
            status: "error",
            message: "(404) Failed to update product.",
        },
        MISSING_PRODUCT: {
            code: 404,
            status: "error",
            message: "(404) Product is missing.",
        },
    },
    BACKEND_LOGIC: {
        code: 500,
        status: "error",
        message: "(500) Internal server error.",
    },
};

export function errorCreator(error: any) {
    const err: any = new Error(error.message);
    err.status = error.code;
    return err;
}

export function responseCreator(
    res: Response,
    response: any,
    payload: any,
): Response<any, Record<string, any>> {
    const output = {
        ...payload,
    };

    if (!output.message && response.message) {
        output.message = response.message;
    }
    return res.status(response.code).json(output);
}
/*
 * status code using OOP method. error code case
 * may consider refine it to be compatible with all status codes.
 * https://medium.com/@it.ermias.asmare/part-two-enhancing-our-express-typescript-and-mongodb-project-51344509cf42
 * */
