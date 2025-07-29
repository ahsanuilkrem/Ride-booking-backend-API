import { envVars } from "../../../config/env";
import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IUser } from "./user.interfaces";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"


const createUser = async (payload : Partial<IUser>) => {

     const { email, password, ...rest} = payload;

     const  isUserExist = await User.findOne({email})
     
     if(isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST, "User Alrader Exist")
     }


     const  hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    //   const isPasswordMatch = await bcryptjs.compare(password as string, hashedPassword)

     const authProvider : IAuthProvider = {provider: "credentials", providerId: email as string}

     const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
     })
     return user
}


const  getAllUsers = async () => { 
    const users = await User.find({});

    const totalUsers = await User.countDocuments()

    return {
        data : users,
        meta : {
            total: totalUsers
        }
    }
} 

 export const UserService = {
    
    createUser,
    getAllUsers,
 
}