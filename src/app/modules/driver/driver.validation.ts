import z from "zod";
import { availaStatus, IsStatus, VEHICLE_TYPE } from "./driver.interfaces";



export const createDriverSchema = z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    addres: z.string().optional(),  
    vehicleType: z.string({ error: "Vehicle type is required" }),
    vehicleModel: z.string({ error: "Vehicle model is required" }),
    licenseNumber: z.string({ error: "License number is required" }),
    vehicleNumber: z
        .string({ error: "vehicle Number must be string" }),
    availability: z
        .enum(Object.values(availaStatus) as [string])
        .optional(),
    status: z
        .enum(Object.values(IsStatus) as [string])
        .optional(),   
    earnings: z
        .number({ error: "earnings must be number" })
        .optional(),
    riderId: z
        .string()
        .optional(),
    userId: z
        .string()
        .optional(),

})

export const updateDriverSchema = z.object({
    vehicleType: z.string({ error: "Vehicle type is required" }),
    vehicleModel: z.string({ error: "Vehicle model is required" }),
    licenseNumber: z.string({ error: "License number is required" }),
    vehicleNumber: z
        .string({ error: "licensePlate must be string" })
        .optional(),   
    availability: z
        .enum(Object.values(availaStatus) as [string])
        .optional(),
    status: z
        .enum(Object.values(IsStatus) as [string, ...string[]])
        .optional(),
    earnings: z
        .number({ error: "earnings must be number" })
        .optional(),

})

export const updateMyDriverProfileZodSchema = z.object({
  vehicleType: z.enum(VEHICLE_TYPE).optional(),
  vehicleModel: z.string().min(1).optional(),
  vehicleNumber: z.string().min(1).optional(),
  licenseNumber: z.string().min(1).optional(),
  availability: z.enum(availaStatus).optional(),
});


export const updateAvailabilityZodSchema = z.object({
    availability: z
        .enum(Object.values(availaStatus) as [string])
});

export const updateDriverStatusZodSchema = z.object({
  status: z.enum(Object.values(IsStatus), {
    error: "Driver status is required", 
  }),
});

