/* eslint-disable @typescript-eslint/no-non-null-assertion */
import AppError from "../../../errorHelpers/AppError";
import httpStatus from "http-status-codes"
import bcryptjs from "bcryptjs"
import { createNewAccessTokenWithRefreshToken, creatUserToken } from "../../../utils/userToken";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { IAuthProvider, IUser } from "../user/user.interfaces";
import { User } from "../user/user.model";


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

const resetPassword = async (oldPassword: string, newPassword: string, decodedToken: JwtPayload) => {


    const user = await User.findById(decodedToken.userId)
    //  console.log(user);

    const isoldPasswordMatched = await bcryptjs.compare(oldPassword, user!.password as string)

    if (!isoldPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, " old password does not match");
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save();


}

const changePassword = async (
    oldPassword: string,
    newPassword: string,
    decodedToken: JwtPayload
) => {
    const user = await User.findById(decodedToken.userId);

    const isOldPasswordMatch = await bcryptjs.compare(
        oldPassword,
        user!.password as string
    );

    if (!isOldPasswordMatch) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            "Old Password Does not matched"
        );
    }

    user!.password = await bcryptjs.hash(
        newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    user!.save();
};

const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (
        user.password &&
        user.auths.some((providerObject) => providerObject.provider === "google")
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "You have already set you password. Now you can change the password from your profile password update"
        );
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    );

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email,
    };

    const auths: IAuthProvider[] = [...user.auths, credentialProvider];

    user.password = hashedPassword;

    user.auths = auths;

    await user.save();
};



export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword

}