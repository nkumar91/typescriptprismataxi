import express from "express";
import allRoutes from "./routes/all.routes.js";
const app = express();
app.use(express.json());
app.use("/api/v1", allRoutes);
export default app;
