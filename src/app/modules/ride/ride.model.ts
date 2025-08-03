
import { model, Schema,  } from "mongoose";
import { IRide, RideStatus } from "./ride.interfaces";

const RideSchema = new Schema<IRide>(
  {
    rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
    driver: { type: Schema.Types.ObjectId, ref: "Driver" },

    pickupLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    destinationLocation: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, required: true },
    },

    status: {
      type: String,
      enum: [
        "requested",
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled_by_rider",
        "cancelled_by_driver",
        "no_driver_available",
      ] as RideStatus[],
      default: "requested",
    },

    timestamps: {
      requestedAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      inTransitAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },

    fare: { type: Number },
  },
  {
    timestamps: true, 
  
  }
);


export const Ride = model<IRide>("Ride", RideSchema);
