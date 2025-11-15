import { model, Schema } from "mongoose";
import { availaStatus, IDriver, IsStatus, VEHICLE_TYPE } from "./driver.interfaces";

const driverSchema = new Schema<IDriver>(
  {
    name:{type:String},
    phone:{type:String},
    addres:{type:String},
    vehicleModel: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: {
      type: String,
      enum: Object.values(VEHICLE_TYPE),
      required: true,
    },
    availability: {
      type: String,
      enum: Object.values(availaStatus),
      default: availaStatus.AVAILABLE
    },
    status: {
      type: String,
      enum: Object.values(IsStatus),
      default: IsStatus.PENDING
    },
    earnings: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    riderId: [{
      type: Schema.Types.ObjectId,
      ref: "Ride",

    }],

  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const Driver = model<IDriver>("driver", driverSchema)

