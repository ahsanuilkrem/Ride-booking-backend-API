
import { Types } from "mongoose";

// export interface ILocation {
//   lat: number;
//   lng: number;
//   address: string;
// }


export interface IRidetimestamps {
  requestedAt?: Date;
  acceptedAt?: Date;
  pickedUpAt?: Date;
  inTransitAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
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
  pickupLocation: string;
  destinationLocation: string;
  date: Date;
  time: string;
  status?: RideStatus;
  rideTimestamps?: IRidetimestamps;
  costFrom?: number;
  user: Types.ObjectId;
  driver?: Types.ObjectId;
  payment?:Types.ObjectId; 
 
}
