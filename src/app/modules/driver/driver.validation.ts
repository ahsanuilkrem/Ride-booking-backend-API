import z from "zod";
import { availaStatus, IsStatus } from "./driver.interfaces";



export const createDriverSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    location: z
        .string({ error: "location must be string" }),
    phone: z.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
         message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
        }),
    vehicleNumber: z
        .string({ error: "licensePlate must be string" }),
    availability: z
        .enum(Object.values(availaStatus) as [string])
        .optional(),
    status: z
        .enum(Object.values(IsStatus) as [string])
        .optional(),
    earnings: z
        .number({ error: "earnings must be number" })
        .optional(),
    rides: z
        .string()
        .optional(),

})

export const updateDriverSchema = z.object({
    name: z
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    location: z
        .string({ error: "location must be string" })
        .optional(),
    phone: z.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
            message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
        })
        .optional(),
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



