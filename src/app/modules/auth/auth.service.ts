/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import { IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, creatUserToken } from "../../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";


const credentialsLogin = async (payload: Partial<IUser>) => {

    const { email, password } = payload;

    const isUserExist = await User.findOne({ email })

    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Email does not Exist")
    }

    const isPasswordMatched = await bcryptjs.compare(password as string, isUserExist.password as string)

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.BAD_REQUEST, "Incorrect password")
    }


     const userTokens = creatUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
     const { password: pass, ...rest } = isUserExist.toObject()

    return {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
          user: rest
    }


}


const getNewAccessToken = async (refreshToken: string) => {

    const newAccessToken = await createNewAccessTokenWithRefreshToken(refreshToken)

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async ( oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {
    
  
     const user = await User.findById(decodedToken.userId)
    //  console.log(user);

    const isoldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string)
      
    if (!isoldPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, " old password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();


}

export const AuthServices = {
     credentialsLogin,
     getNewAccessToken,
     resetPassword
}