import passport from "passport"; //https://www.npmjs.com/package/@types/passport
import * as JWT from "./jsonWebToken";
import express, { Response } from "express";
import User from "../postgres-models/user";
const GitHubStrategy: any = require("passport-github2").Strategy;

const BACK_END_BASE_URL: string =
    process.env.BACK_END_BASE_URL || "http://localhost:3000";
const FRONT_END_BASE_URL: string =
    process.env.FRONT_END_BASE_URL || "http://localhost:5173";

export default function configureGithubOAuth(
    app: express.Express,
    passport: passport.PassportStatic,
): void {
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
        return;
    }

    // https://www.passportjs.org/packages/passport-github2/
    passport.use(
        new GitHubStrategy(
            {
                clientID: process.env.GITHUB_CLIENT_ID,
                clientSecret: process.env.GITHUB_CLIENT_SECRET,
                callbackURL: BACK_END_BASE_URL + "/auth/github/secrets",
            },

            async function (
                accessToken: string,
                refreshToken: any,
                profile: any,
                cb: Function,
            ): Promise<void> {
                try {
                    const user: [User, boolean] = await User.findOrCreate({
                        where: {
                            userId: profile._json.login,
                            // userOAuthToken: accessToken,
                            userOAuthProvider: "github",
                        },
                        defaults: {
                            userPassword: accessToken,
                            userEmail: profile._json.html_url,
                            userFamilyName: profile._json.name,
                            userGivenName: profile._json.name,
                            userProfilePictureUrl: profile._json.avatar_url,
                            userPermission: "user",
                        },
                    });

                    if (user) {
                        cb(null, {
                            userId: profile._json.login,
                        });
                    } else {
                        cb(user, null);
                    }
                } catch (error) {
                    cb(error, null);
                }
            },
        ),
    );
    app.get(
        "/auth/github",
        passport.authenticate("github", { scope: ["profile", "email"] }),
    );

    app.get(
        "/auth/github/secrets",
        passport.authenticate("github", { failureRedirect: "/login" }),
        function (req: any, res: Response): void {
            console.log("req.user.userId", req.user.userId);
            const jwt: String = JWT.create({
                userId: req.user.userId,
            });

            // res.cookie("token", jwt);
            res.redirect(`${FRONT_END_BASE_URL}/oauth?token=${jwt}`);
        },
    );
}
