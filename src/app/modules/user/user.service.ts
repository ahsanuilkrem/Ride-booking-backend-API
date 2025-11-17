import { envVars } from "../../../config/env";
import AppError from "../../../errorHelpers/AppError";
import { IAuthProvider, IsActive, IUser, Role } from "./user.interfaces";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { JwtPayload } from "jsonwebtoken";


const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Alrader Exist")
    }


    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))



    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user
}


const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found")
    }
    if (payload.role) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }


    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }


    if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdateUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdateUser

}

const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments()

    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}


const UserBlock = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found")
    }
      if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to block users');
    }

    if (payload.isActive) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }

      if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }

    isUserExist.isActive = IsActive.BLOCKED;
    await isUserExist.save();
    return isUserExist;

}

const UserUnBlock = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found")
    }
      if (decodedToken.role !== Role.ADMIN) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized to block users');
    }

    if (payload.isActive) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }

      if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decodedToken.role === Role.RIDER || decodedToken.role === Role.DRIVER) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }

    isUserExist.isActive = IsActive.ACTIVE;
    await isUserExist.save();
    return isUserExist;

}

const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const updateUserProfile = async (id: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    const isUserExist = await User.findById(id);

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found")
    }
   
     if (payload.isActive) {
        if (decodedToken.isActive === IsActive.BLOCKED || decodedToken.isActive === IsActive.INACTIVE ) {
            throw new AppError(httpStatus.FORBIDDEN, "yor are not Authorized")
        }
    }

      if (payload.password) {
        payload.password = await bcryptjs.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdateUser = await User.findByIdAndUpdate(id, payload, {
         new: true,
         runValidators: true 
        })

    return newUpdateUser

}


export const UserService = {

    createUser,
    updateUser,
    getAllUsers,
    UserBlock,
    UserUnBlock,
    getMe,
    updateUserProfile

}