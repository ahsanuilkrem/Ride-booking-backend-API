"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ride = void 0;
const mongoose_1 = require("mongoose");
const ride_interfaces_1 = require("./ride.interfaces");
const LocationSchema = new mongoose_1.Schema({
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
}, { _id: false });
const RideSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", },
    driver: { type: mongoose_1.Schema.Types.ObjectId, ref: "driver", require: true, },
    payment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Payment" },
    pickupLocation: { type: LocationSchema, required: true },
    pickupAddress: { type: String, required: true },
    destinationLocation: { type: LocationSchema, required: true },
    destinationAddress: { type: String, required: true },
    date: { type: Date, },
    status: { type: String,
        enum: Object.values(ride_interfaces_1.RideStatus),
        default: ride_interfaces_1.RideStatus.requested,
    },
    fare: { type: Number, default: 0 },
    vehicleType: { type: String,
        enum: Object.values(ride_interfaces_1.VehicleType),
    },
    rideTimestamps: {
        requestedAt: { type: Date, default: Date.now },
        acceptedAt: { type: Date },
        pickedUpAt: { type: Date },
        inTransitAt: { type: Date },
        completedAt: { type: Date },
        cancelledAt: { type: Date },
    },
    paymentMethod: { type: String,
        enum: Object.values(ride_interfaces_1.paymentMethod),
    },
}, {
    timestamps: true,
    versionKey: false
});
exports.Ride = (0, mongoose_1.model)("Ride", RideSchema);
