/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { UserService } from "./user.service"
import { catchAsync } from "../../../utils/catchAsyncts"
import { sendResponse } from "../../../utils/sendRespone"
import { JwtPayload } from "jsonwebtoken"
import { verifyToken } from "../../../utils/jwt"
import { envVars } from "../../../config/env"




// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createUser = catchAsync(async (req: Request, res : Response, next : NextFunction) => {
    
    const user = await UserService.createUser(req.body)  


   sendResponse(res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User Created Successfully",
      data : user
   })

})

const updateUser = catchAsync(async (req: Request, res : Response, next : NextFunction) => {

   const userId = req.params.id;
   const verifiedToken = req.user;
   const payload = req.body;
   const user = await UserService.updateUser(userId, payload, verifiedToken as JwtPayload)  


   sendResponse(res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User Updated Successfully",
      data : user
   })

})

const getAllUsers = catchAsync ( async (req: Request, res : Response, next : NextFunction) => {
   
      const result = await UserService.getAllUsers();

         sendResponse(res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "All Users Retrieved Successfully",
      data : result.data,
      meta : result.meta
   })
   
})


const Userblock = catchAsync(async (req: Request, res : Response, next : NextFunction) => {

   const userId = req.params.id;
   const verifiedToken = req.user;
   const payload = req.body;
   const user = await UserService.UserBlock(userId, payload, verifiedToken as JwtPayload)  


   sendResponse(res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User blocked Successfully",
      data : user
   })

})

const UserUnblock = catchAsync(async (req: Request, res : Response, next : NextFunction) => {

   const userId = req.params.id;
   const verifiedToken = req.user;
   const payload = req.body;
   const user = await UserService.UserUnBlock(userId, payload, verifiedToken as JwtPayload)  


   sendResponse(res, {
      success : true,
      statusCode : httpStatus.CREATED,
      message : "User blocked Successfully",
      data : user
   })

})

export const UserControllers = {
    createUser,
    updateUser,
    getAllUsers,
    Userblock,
    UserUnblock
 
}