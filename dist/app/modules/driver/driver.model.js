"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interfaces_1 = require("./driver.interfaces");
const driverSchema = new mongoose_1.Schema({
    name: { type: String },
    phone: { type: String },
    addres: { type: String },
    vehicleModel: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: {
        type: String,
        enum: Object.values(driver_interfaces_1.VEHICLE_TYPE),
        required: true,
    },
    availability: {
        type: String,
        enum: Object.values(driver_interfaces_1.availaStatus),
        default: driver_interfaces_1.availaStatus.AVAILABLE
    },
    status: {
        type: String,
        enum: Object.values(driver_interfaces_1.IsStatus),
        default: driver_interfaces_1.IsStatus.PENDING
    },
    earnings: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    riderId: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Ride",
        }],
}, {
    timestamps: true,
    versionKey: false
});
exports.Driver = (0, mongoose_1.model)("driver", driverSchema);
