"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialRideUpdateSchema = exports.updateRideStatusSchema = exports.requestRideSchema = void 0;
const zod_1 = require("zod");
const ride_interfaces_1 = require("./ride.interfaces");
const RideStatus = zod_1.z.enum([
    'requested',
    'accepted',
    'picked_up',
    'in_transit',
    'completed',
    'cancelled_by_rider',
    'cancelled_by_driver',
    'no_driver_available'
]);
const locationSchema = zod_1.z.object({
    lat: zod_1.z.number({
        error: "Latitude must be a number and required",
    }),
    lng: zod_1.z.number({
        error: "Longitude must be a  number and required",
    }),
});
exports.requestRideSchema = zod_1.z.object({
    pickupLocation: locationSchema,
    pickupAddress: zod_1.z.string(),
    destinationLocation: locationSchema,
    destinationAddress: zod_1.z.string(),
    date: zod_1.z.coerce.date(),
    vehicleType: zod_1.z.enum(Object.values(ride_interfaces_1.VehicleType)),
    driver: zod_1.z.string(),
    fare: zod_1.z.number().optional(),
    paymentMethod: zod_1.z.enum(Object.values(ride_interfaces_1.paymentMethod)).optional(),
});
exports.updateRideStatusSchema = zod_1.z.object({
    pickupLocation: zod_1.z.string().optional(),
    destinationLocation: zod_1.z.string().optional(),
    date: zod_1.z.string().optional(),
    vehicleType: zod_1.z.enum(Object.values(ride_interfaces_1.VehicleType)).optional(),
    fare: zod_1.z.number().optional(),
    status: RideStatus.optional(),
});
exports.partialRideUpdateSchema = zod_1.z.object({
    pickupLocation: zod_1.z.string().optional(),
    destinationLocation: zod_1.z.string().optional(),
    status: RideStatus.optional(),
    // notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
});
