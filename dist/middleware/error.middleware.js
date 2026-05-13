export const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
        success: "failed",
        message: error.message || "Internal Server Error",
    });
};
