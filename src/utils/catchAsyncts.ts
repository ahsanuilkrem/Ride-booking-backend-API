import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";


type AsyncHandler = (req: Request, res : Response, next : NextFunction) => Promise<void>

export const catchAsync = (fn:AsyncHandler) => (req: Request, res : Response, next : NextFunction) => {
  
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   Promise.resolve(fn(req, res, next)).catch((err: any) => {
       if(envVars.NODE_ENV === "development"){
              console.log(err);
          }
      next(err)
   })
}