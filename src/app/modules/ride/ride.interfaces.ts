
import { Types } from "mongoose";


export interface IRidetimestamps {
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

export interface ILocation {
  lat: number;
  lng: number;
 
};



export enum paymentMethod {
  cash="cash",
  card= "card", 
} 

export enum VehicleType{
  CAR="CAR",
  BIKE="BIKE"
}

export enum RideStatus {
  requested ="requested",
  accepted = "accepted",
  picked_up = "picked_up",
  in_transit = "in_transit",
  completed = "completed",
  cancelled_by_rider = "cancelled_by_rider",
  cancelled_by_driver = "cancelled_by_driver",
  no_driver_available = "no_driver_available"
}


export interface IRide {
   _id?: Types.ObjectId;
  userId: Types.ObjectId;
  driver: Types.ObjectId; 
  pickupLocation: ILocation;
  pickupAddress: string;
  destinationLocation: ILocation;
  destinationAddress: string;
  date: Date;
  fare?: number;
  status: RideStatus;
  vehicleType:VehicleType;
  rideTimestamps?: IRidetimestamps;
  paymentMethod ?: paymentMethod;
  payment?:Types.ObjectId;
  createdAt?: string;
  updatedAt?: string; 
 
}


