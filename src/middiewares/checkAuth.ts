

import { NextFunction, Request, Response } from "express";
import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import { verifyToken } from "../utils/jwt";
import { envVars } from "../config/env";
import { JwtPayload } from "jsonwebtoken";
import { User } from "../app/modules/user/user.model";
import { IsActive, IsBlocked } from "../app/modules/user/user.interfaces";



export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {

   
  try {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new AppError(403, "no token recievd")
    }

     const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

  
  
    const isUserExist = await User.findOne({ email: verifiedToken.email })

    if (!isUserExist) {
      throw new AppError(httpStatus.BAD_REQUEST, "user does not Exist")
    }

    if (isUserExist.isActive === IsActive.INACTIVE) {
      throw new AppError(httpStatus.BAD_REQUEST, `user is ${isUserExist.isActive}`)
    }
    if (isUserExist.isBlocked === IsBlocked.BLOCKED) {
      throw new AppError(httpStatus.BAD_REQUEST, `user is ${isUserExist.isBlocked}`)
    }
    if (isUserExist.isDeleted) {
      throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
    }



    if (!authRoles.includes(verifiedToken.role)) {

      throw new AppError(403, "You are not premitted to  view  this route!!1")
    }
    
    req.user = verifiedToken
    next()

  } catch (error) {
    console.log("jwt error", error)
    next(error);

  }
}