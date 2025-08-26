
import { model, Schema,  } from "mongoose";
import { IRide, RideStatus,  } from "./ride.interfaces";

const RideSchema = new Schema<IRide>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", },
    driver: { type: Schema.Types.ObjectId,  ref: "Driver" },
    payment : {type: Schema.Types.ObjectId, ref: "Payment"},
    pickupLocation: {type:String, required: true},
    destinationLocation: {type:String, required: true},
    date: {type:Date, },
    time: {type: String},
    status: {type: String,
       enum: Object.values(RideStatus),
        default: RideStatus.requested,
     },
    rideTimestamps: {
      requestedAt: { type: Date, default: Date.now },
      acceptedAt: { type: Date },
      pickedUpAt: { type: Date },
      inTransitAt: { type: Date },
      completedAt: { type: Date },
      cancelledAt: { type: Date },
    },
   costFrom: { type: Number },

  },
  {
    timestamps: true, 
  
  }
);


export const Ride = model<IRide>("Ride", RideSchema);


// pickupLocation: {
    //   lat: { type: Number, required: true },
    //   lng: { type: Number, required: true },
    //   address: { type: String, required: true },
    // },

    // destinationLocation: {
    //   lat: { type: Number, required: true },
    //   lng: { type: Number, required: true },
    //   address: { type: String, required: true },
    // },

    
    // costFrom: { type: Number },