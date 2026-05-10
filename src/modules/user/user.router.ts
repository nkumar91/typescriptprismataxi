import express,{Request,Response} from "express";
const userRouter = express.Router();

userRouter.get("/", (req: Request, res: Response) => {
  res.send("Get all users");
});

export default userRouter;