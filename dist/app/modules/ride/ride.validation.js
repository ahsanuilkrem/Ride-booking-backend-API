"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.partialRideUpdateSchema = exports.updateRideStatusSchema = exports.requestRideSchema = void 0;
const zod_1 = require("zod");
const locationSchema = zod_1.z.object({
    lat: zod_1.z
        .number({ error: "Latitude must be a number" })
        .min(-90, "Latitude must be >= -90")
        .max(90, "Latitude must be <= 90"),
    lng: zod_1.z
        .number({ error: "Longitude must be a number" })
        .min(-180, "Longitude must be >= -180")
        .max(180, "Longitude must be <= 180"),
    address: zod_1.z
        .string({ error: "Address is required" })
        .min(5, "Address must be at least 5 characters"),
});
exports.requestRideSchema = zod_1.z.object({
    pickupLocation: locationSchema,
    destinationLocation: locationSchema,
});
exports.updateRideStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled_by_rider",
        "cancelled_by_driver",
        "no_driver_available",
    ]),
});
exports.partialRideUpdateSchema = zod_1.z.object({
    pickupLocation: locationSchema.optional(),
    destinationLocation: locationSchema.optional(),
    status: zod_1.z
        .enum([
        "accepted",
        "picked_up",
        "in_transit",
        "completed",
        "cancelled_by_rider",
        "cancelled_by_driver",
        "no_driver_available",
    ])
        .optional(),
    fare: zod_1.z.number().positive("Fare must be a positive number").optional(),
    notes: zod_1.z.string().max(300, "Notes cannot exceed 300 characters").optional(),
});
