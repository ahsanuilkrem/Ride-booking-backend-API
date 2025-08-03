"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const mongoose_1 = require("mongoose");
const driver_interfaces_1 = require("./driver.interfaces");
const driverSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    phone: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    availability: {
        type: String,
        enum: Object.values(driver_interfaces_1.availaStatus),
        default: driver_interfaces_1.availaStatus.OFFLINE
    },
    status: {
        type: String,
        enum: Object.values(driver_interfaces_1.IsStatus),
        default: driver_interfaces_1.IsStatus.PENDING
    },
    earnings: { type: Number, default: 0 },
    rides: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Ride",
    },
}, { timestamps: true });
exports.Driver = (0, mongoose_1.model)("driver", driverSchema);
