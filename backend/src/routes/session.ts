import express, { Express, Request, Response } from "express";

const router = express.Router();
const app: Express = express();

// router.get("/signup", async (req: Request, res: Response) => {
//   try {
//     const users = await PGModels.User.findAll();
//     res.json(users);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Error" });
//   }
// });

export default router;
