import express from "express";
import allRoutes from "./routes/all.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { applyParserMiddleware } from "./middleware/parser.middleware.js";
const app = express();

//parse incoming request bodies
applyParserMiddleware(app);
// Register all routes with the base path /api/v1
app.use("/api/v1",allRoutes);
// Global error handling middleware
app.use(errorHandler);
export default app;
