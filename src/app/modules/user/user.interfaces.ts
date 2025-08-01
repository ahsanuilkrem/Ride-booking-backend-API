import { Types } from "mongoose";


export enum Role {
    ADMIN = "ADMIN",
    RIDER = "RIDER",
    DRIVER = "DRIVER"
}


export interface IAuthProvider {
    provider : "google" | "credentials";
    providerId : string;

}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
   

}

export enum IsBlocked {
    BLOCKED = "BLOCKED",
    UNBLOCKED = "UNBLOCKED"

}


export interface IUser {
    _id ?: Types.ObjectId
    name : string;
    email: string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isBlocked?: IsBlocked;
    isVerified?: boolean;
    role: Role;
    auths : IAuthProvider[]
    booking ?: Types.ObjectId[]
    guides ?: Types.ObjectId[]
}