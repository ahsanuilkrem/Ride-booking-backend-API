import { JwtPayload } from "jsonwebtoken"
import { IsActive, IUser } from "../app/modules/user/user.interfaces"
import { User } from "../app/modules/user/user.model"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { generateToken, verifyToken } from "./jwt"
import httpStatus from "http-status-codes"

export const creatUserToken = (user : Partial<IUser>) => {

       const jwtPayload = {
    
            userId : user._id,
            email : user.email,
            role : user.role
         }
    
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)
    
        const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRES)

        return {
            accessToken,
            refreshToken
        }

}   


export const createNewAccessTokenWithRefreshToken = async (refreshToken : string) => {

      const verifiedRefreshToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload
        
          const  isUserExist = await User.findOne({email: verifiedRefreshToken.email})
        
         if(!isUserExist){
            throw new AppError(httpStatus.BAD_REQUEST, "user does not Exist")
         }
         
          if(isUserExist.isActive === IsActive.INACTIVE ){
            throw new AppError(httpStatus.BAD_REQUEST, `user is ${isUserExist.isActive}`)
         }
    
    
          if(isUserExist.isDeleted){
            throw new AppError(httpStatus.BAD_REQUEST, "user is deleted")
         }
    
        const jwtPayload = {
            userId : isUserExist._id,
            email : isUserExist.email,
            role : isUserExist.role
         }
        const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES)

        return accessToken
}