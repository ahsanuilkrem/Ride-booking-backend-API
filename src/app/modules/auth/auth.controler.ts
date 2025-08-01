import { NextFunction, Request, Response } from "express"
import { catchAsync } from "../../../utils/catchAsyncts"
import { sendResponse } from "../../../utils/sendRespone"
import httpStatus from "http-status-codes"
import { AuthServices } from "./auth.service"
import AppError from "../../../errorHelpers/AppError"
import { setAuthCookie } from "../../../utils/setCooki"
import { JwtPayload } from "jsonwebtoken"


// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
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


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

   const newPassword = req.body.newPassword;
   const oldPassword = req.body.oldPassword;
   const decodedToken = req.user

   // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
   await AuthServices.resetPassword(oldPassword, newPassword, decodedToken as JwtPayload);

   sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "password changed Successfully",
      data: null,
   })

})

export const Authcontrollers = {
   credentialsLogin,
   getNewAccessToken,
   logout,
   resetPassword,

}