import * as JWT from "./lib/jsonWebToken";
import express, { Response, Express, NextFunction, Request } from "express";
import "dotenv/config"; // https://www.npmjs.com/package/dotenv
import cors from "cors"; // Enable Cross-Origin Resource Sharing
import bodyParser from "body-parser"; // Parse incoming request bodies
import userRoutes from "./routes/users";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/order";
import paymentRoutes from "./routes/payment";
import productQuery from "./routes/product";
import adminProduct from "./routes/admin/product";
import adminOrder from "./routes/admin/order";
import { connect } from "mongoose";
import session from "express-session"; //https://www.npmjs.com/package/@types/express-session
import passport from "passport"; //https://www.npmjs.com/package/@types/passport
import configureGoogleOAuth from "./lib/oauth-google";
import DBSeed from "./db-seed";
// TypeScript: use `npm i @types/express-session @types/passport --save`

// Initialize database connection
import sequelize from "./db";

import configureGithubOAuth from "./lib/oauth-github";

const app: Express = express();
const port: string | 3000 = process.env.PORT || 3000;
const MONGO_URI: string = process.env.MONGO_URI || "mongodb://mongo:27017/test";

/* Middlewares here */

// for handling CORS
app.use(
    cors({
        origin: "*",
    }),
);

// for JsnWebToken Secret
// const token: string = jwt.sign({ data: 'payload' }, 'secret');
app.use(express.json());

// for parsing JSON payloads
app.use(bodyParser.json());

// SET UP SESSION for OAuth ------below code comes from express-session

// try {
//     let secret: string | undefined = process.env.PASSPORT_LONG_SECRET;
//     if (secret || !(secret === undefined)) {
//         app.use(
//             session({
//                 secret:
//                     process.env.PASSPORT_LONG_SECRET || "Our little secret.",
//                 resave: false,
//                 saveUninitialized: false,
//             }),
//         );
//     }
// } catch (err) {
//     console.error("You have to provide secret.");
// }

let secret: string | undefined = process.env.PASSPORT_LONG_SECRET;
if (secret) {
    app.use(
        session({
            secret: process.env.PASSPORT_LONG_SECRET || "Our little secret.",
            resave: false,
            saveUninitialized: false,
        }),
    );
    // Initialize and use passport.
    app.use(passport.initialize());
    app.use(passport.session());

    // Only Use passport when PASSPORT_LONG_SECRET is defined
    configureGoogleOAuth(app, passport);
    configureGithubOAuth(app, passport);

    // https://www.passportjs.org/tutorials/google/session/
    passport.serializeUser(function (user: any, cb: Function): void {
        process.nextTick(function (): void {
            cb(null, { user: user });
        });
    });

    passport.deserializeUser(function (user: any, cb: Function): void {
        process.nextTick(function (): any {
            return cb(null, user);
        });
    });
}

/*
const [user, created] = await User.findOrCreate({
  where: { username: 'sdepold' },
  defaults: {
    job: 'Technical Lead JavaScript',
  },
});
console.log(user.username); // 'sdepold'
console.log(user.job); // This may or may not be 'Technical Lead JavaScript'
console.log(created); // The boolean indicating whether this instance was just created
if (created) {
  console.log(user.job); // This will certainly be 'Technical Lead JavaScript'
}

*/

// // -------GITHUB STRATEGY--------
// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/github/secrets"
//   },

// /* To-do: Rewrite in TypeScript*/

// function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ githubId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));

// for routes
app.use("/users", userRoutes);
app.use("/products", productQuery);

app.use("/carts", JWT.verity);
app.use("/carts", cartRoutes);

app.use("/payment", JWT.verity, paymentRoutes);

app.use("/orders", JWT.verity, orderRoutes);

// Root route for basic health check
app.get("/", (req: Request, res: Response): void => {
    res.send("Hello World!");
});

const allowManagementRoles: string[] = ["admin", "supplier"];
app.use("/admin", JWT.verity);
app.use("/admin", function (req: any, res: Response, next: NextFunction): void {
    console.log(
        "req.currentUser.userPermission",
        req.currentUser.userPermission,
    );
    console.log("allowManagementRoles", allowManagementRoles);
    if (!allowManagementRoles.includes(req.currentUser.userPermission)) {
        return next(
            new Error(`You must be one of ${allowManagementRoles.join(", ")}`),
        );
    }

    next();
});
app.use("/admin", adminProduct);
app.use("/admin", adminOrder);

/* Import route handlers here */

// ERROR HANDLER MUST BE THE FINAL ROUTE
require("./lib/errorHandler")(app);

/*
 * Main function, only run once at the application startup.
 * */
// import mockProducts from '../../mock/product'
(async (): Promise<void> => {
    try {
        /*
         * Testing MongoDB connecting here.
         * */
        console.log("Connecting to mongo");
        const db = await connect(MONGO_URI);
        console.log("MongoDB is connected to ", db.connection.name);
        // await connect(MONGO_URI); // https://mongoosejs.com/docs/typescript.html

        // await Product.create({
        //     title: "test product",
        // })
    } catch (error) {
        console.error(error);
    }

    // if(await Product.countDocuments() === 0) {
    //     mockProducts.forEach(product => {
    //         const _product :any = product
    //         delete _product.id;
    //         Product.create(_product)
    //     })

    // }

    /*
     * Add Schemas here. https://stackoverflow.com/questions/42497254/sequelize-schema-for-postgresql-how-to-accurately-define-a-schema-in-a-model
     * Create schemas if not already present in the Postgres database
     * */
    console.log("Checking Postgres database schema");
    try {
        await sequelize.createSchema("user_management", { logging: false });
        await sequelize.createSchema("order_management", { logging: false });
        // await sequelize.createSchema('add_some_schema', { logging: false });
    } catch (err) {
        // Ignore schema creation errors (e.g., schema already exists)
    }

    console.log("Syncing Postgres database");
    try {
        // Sync database postgres-models with the database
        await sequelize.sync({
            // force: true, // for development to reset tables
            alter: true, // Safe adjustment for schema updates
        });
    } catch (err) {
        console.error("error", err);
    }

    await DBSeed();

    // Start the application, listening on the specified port
    app.listen(port, (): void => {
        console.log(`E-Commerce Application is listening on port ${port}`);
        console.log("\n========== Console Logging Below ==========\n");
    });
})();
