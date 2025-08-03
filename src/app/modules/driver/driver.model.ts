import { model, Schema } from "mongoose";
import { availaStatus, IDriver, IsStatus } from "./driver.interfaces";

const driverSchema = new Schema<IDriver>(
  {

    name: {type: String, required: true },
    location: {type: String, required: true },
    phone: {type: String, required: true },
    vehicleNumber: { type: String, required: true },
    availability: {
      type: String,
      enum: Object.values(availaStatus),
      default: availaStatus.OFFLINE
    },
    status: {
      type: String,
      enum: Object.values(IsStatus),
      default: IsStatus.PENDING
    },
    earnings: { type: Number, default: 0 },
     rides: {
        type: Schema.Types.ObjectId,
        ref: "Ride",
       
    },

  },
  { timestamps: true }
);

export const Driver = model<IDriver>("driver", driverSchema)

