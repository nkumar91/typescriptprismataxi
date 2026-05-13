import express from "express";
export const applyParserMiddleware = (app) => {
    // application label middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
};
