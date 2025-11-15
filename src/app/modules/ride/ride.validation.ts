
import { z } from "zod";
import { paymentMethod, VehicleType } from "./ride.interfaces";


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



const locationSchema = z.object({
  lat: z.number({   
    error: "Latitude must be a number and required",
  }),
  lng: z.number({
    error: "Longitude must be a  number and required",
  }),
  
});


export const requestRideSchema = z.object({
  pickupLocation: locationSchema,
  pickupAddress: z.string(),
  destinationLocation: locationSchema,
  destinationAddress: z.string(),
  date: z.coerce.date(),
  vehicleType: z.enum(Object.values(VehicleType)),
  driver:z.string(),
  fare: z.number().optional(),
  paymentMethod: z.enum(Object.values(paymentMethod)).optional(),  

});


export const updateRideStatusSchema = z.object({
  pickupLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  date: z.string().optional(),
  vehicleType:z.enum(Object.values(VehicleType)).optional(),
  fare: z.number().optional(),
  status: RideStatus.optional(),

});


export const partialRideUpdateSchema = z.object({
  pickupLocation: z.string().optional(),
  destinationLocation: z.string().optional(),
  status: RideStatus.optional(),

  // notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
});



