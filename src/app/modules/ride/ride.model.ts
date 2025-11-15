
import { model, Schema, } from "mongoose";
import { IRide, paymentMethod, RideStatus, VehicleType, } from "./ride.interfaces";

const LocationSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    
  },
  { _id: false } 
);


const RideSchema = new Schema<IRide>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", },
    driver: { type: Schema.Types.ObjectId, ref:"driver",  require:true, },
    payment: { type: Schema.Types.ObjectId, ref: "Payment" },
    pickupLocation: { type: LocationSchema, required: true },
    pickupAddress:{ type: String, required: true },
    destinationLocation: { type: LocationSchema, required: true },
    destinationAddress:{ type: String, required: true },
    date: { type: Date, },
    status: {type: String,
      enum: Object.values(RideStatus),
      default: RideStatus.requested,
    },
    fare:{type:Number, default:0},
    vehicleType:{type:String, 
      enum: Object.values(VehicleType),
    },
    rideTimestamps: {
      requestedAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      inTransitAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
    paymentMethod: {type: String,
      enum: Object.values(paymentMethod), 
    },
  },
  {
    timestamps: true,
    versionKey: false

  }
);


export const Ride = model<IRide>("Ride", RideSchema);


