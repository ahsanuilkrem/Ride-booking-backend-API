
import { Types } from "mongoose";


export type RideStatus =
  | "requested"
  | "accepted"
  | "picked_up"
  | "in_transit"
  | "completed"
  | "cancelled_by_rider"
  | "cancelled_by_driver"
  | "no_driver_available";


export interface ILocation {
  lat: number;
  lng: number;
  address: string;
}


export interface IRideTimestamps {
  requestedAt: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}


export interface IRide {
  _id?: Types.ObjectId;
  rider: Types.ObjectId;
  driver?: Types.ObjectId;
  pickupLocation: ILocation;
  destinationLocation: ILocation;
  status: RideStatus;
  timestamps: IRideTimestamps;
  fare?: number;
 
}
