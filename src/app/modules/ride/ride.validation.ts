
import { z } from "zod";
// import { RideStatus } from "./ride.interfaces";

const RideStatus = z.enum([
  'requested',
  'accepted',
  'picked_up',
  'in_transit',
  'completed',
  'cancelled_by_rider',
  'cancelled_by_driver',
  'no_driver_available'
]);


export const requestRideSchema = z.object({
  pickupLocation: z.string(),
  destinationLocation: z.string(),
  date: z.string(),
  time: z.string(),
  costFrom: z.string().optional(),
  status: RideStatus.optional()

});


export const updateRideStatusSchema = z.object({
  pickupLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  costFrom: z.string().optional(),
  status: RideStatus.optional()

});


export const partialRideUpdateSchema = z.object({
  pickupLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  status: RideStatus.optional(),
  costFrom: z.number().positive("Fare must be a positive number").optional(),
  notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
});

// const locationSchema = z.object({
//   lat: z
//     .number({error: "Latitude must be a number" })
//     .min(-90, "Latitude must be >= -90")
//     .max(90, "Latitude must be <= 90"),
//   lng: z
//     .number({ error: "Longitude must be a number" })
//     .min(-180, "Longitude must be >= -180")
//     .max(180, "Longitude must be <= 180"),
//   address: z
//     .string({ error: "Address is required" })
//     .min(5, "Address must be at least 5 characters"),
// });

//  status: z
// .enum([
//   "accepted",
//   "picked_up",
//   "in_transit",
//   "completed",
//   "cancelled_by_rider",
//   "cancelled_by_driver",
//   "no_driver_available",
// ] as [RideStatus, ...RideStatus[]])
// .optional(),