import { Types } from "mongoose";

export enum availaStatus {
    AVAILABLE   = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE",
    ON_TRIP     = "ON_TRIP",
}

export enum IsStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SUSPEND = "SUSPEND",
}

export enum VEHICLE_TYPE {
    CAR = "CAR",
    BIKE = "BIKE",
    VAN = "VAN",
}

export interface IDriver {
    _id?: Types.ObjectId;
    name?:string,
    phone?: string,
    addres?: string,
    userId: Types.ObjectId;
    vehicleType: VEHICLE_TYPE;
    vehicleModel: string;
    licenseNumber: string;
    vehicleNumber: string;
    availability?: availaStatus;
    status?: IsStatus;
    earnings?: number;
    appliedAt: Date;
    approvedAt?: Date;
    riderId?: Types.ObjectId[];

}

export interface UpdateMyDriverProfile {
  vehicleType?: VEHICLE_TYPE;
  vehicleModel?: string;
  vehicleNumber?: string;
  licenseNumber?: string;
  availability?: availaStatus;
}


























