import express from "express";

export const applyParserMiddleware = (app: express.Application) => {
    // application label middleware
    app.use(express.json()); 
    app.use(express.urlencoded({extended:true}))
}
