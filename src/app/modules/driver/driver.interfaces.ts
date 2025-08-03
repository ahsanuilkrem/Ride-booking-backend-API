import { Types } from "mongoose";

export enum availaStatus {
      ONLINE ="online",
      OFFLINE ="offline"
} 
export enum IsStatus  {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    SUSPENDED = "SUSPENDED"
}

export interface IDriver {
    _id?: Types.ObjectId;
    name: string;
    location: string;
    phone: string;
    vehicleNumber: string;
    availability?: availaStatus;
    status?: IsStatus;
    earnings?: number;
    rides : Types.ObjectId
    
}


























