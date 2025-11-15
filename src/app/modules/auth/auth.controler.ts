/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../../utils/catchAsyncts"
import { sendResponse } from "../../../utils/sendRespone"
import { AuthServices } from "./auth.service"
import AppError from "../../../errorHelpers/AppError"
import { setAuthCookie } from "../../../utils/setCooki"
import { JwtPayload } from 'jsonwebtoken';
import httpStatus  from 'http-status-codes';


const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   const loginInfo = await AuthServices.credentialsLogin(req.body)

   setAuthCookie(res, loginInfo)

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged in Successfully",
      data: loginInfo,
   })
})


const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   const refreshToken = req.cookies.refreshToken;
   if (!refreshToken) {
      throw new AppError(httpStatus.BAD_REQUEST, "No refres token recieved from cookies")
   }
   const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

   setAuthCookie(res, tokenInfo)

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "New Access Token Retrivsd Successfully",
      data: tokenInfo,
   })

})


const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
   })

   res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
   })

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged out in Successfully",
      data: null,
   })

})



const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   const newPassword = req.body.newPassword;
   const oldPassword = req.body.oldPassword;
   const decodedToken = req.user


   await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "password changed Successfully",
      data: null,
   })

})

const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;
    const decodedToken = req.user;

    await AuthServices.changePassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

const setPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password Changed Successfully",
      data: null,
    });
  }
);

export const Authcontrollers = {
   credentialsLogin,
   getNewAccessToken,
   logout,
   resetPassword,
   changePassword,
   setPassword

}