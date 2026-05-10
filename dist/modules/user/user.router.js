import express from "express";
const userRouter = express.Router();
userRouter.get("/", (req, res) => {
    res.send("Get all users");
});
export default userRouter;
