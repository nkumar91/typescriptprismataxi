import express from "express";

export const applyParserMiddleware = (app:any) => {
    // application label middleware
    app.use(express.json()); 
    app.use(express.urlencoded({extended:true}))
}
