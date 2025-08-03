import { NextFunction, Request, Response } from "express"
import AppError from "../errorHelpers/AppError"
import { envVars } from "../config/env"



// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
export const  globalErrorHandler = (err: any, req: Request, res : Response, next : NextFunction) => {


    if(envVars.NODE_ENV === "development"){
        console.log(err);
    }

    let statusCode = 500
    let message =  "Something went wrong!!"


    if(err.code === 11000){
        const matcheArray = err.message.match(/"([^"]*)"/)
        statusCode = 400
        message = `${matcheArray[1]} already exists!!`
    }
     if(err.name === "CastError"){
        statusCode = 400;
        message = "Invalid MongoDB ObjectID. Please provide a valid id"
    }
   else if(err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }else if (err instanceof Error){
        statusCode = 500;
        message = err.message
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack : envVars.NODE_ENV === "development" ? err.stack : null,
    })
}