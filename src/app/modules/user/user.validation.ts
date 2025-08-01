import z from "zod";
import { IsActive, IsBlocked,  Role } from "./user.interfaces";



  export const creatUserZodSchema = z.object({
            name : z
            .string({ error : "Name must be string"})
            .min(2, {message: "Name  must be at least 2 character long "})
            .max(50, {message: "Name cannot exceed 50 characters."}),
            email: z
            .string({ error : "Email must be string"})
            .email ({message: " Invelid email address format."})
            .min(5, {message : "Email must be at least 5 character long"})
            .max(50, {message: "Email cannot exceed 50 characters."}),
            password: z
            .string({ error : "Password must be string"})
            .min(6, {message:"must be at least 6 character long"})
            .regex(/^(?=.*[A-Z])/, {
                message: "Password must contain at least 1 upppercase letter. ",
            })
            .regex(/^(?=.*[!@#$%^&*])/, {
                message: "Password must contain at least 1  special character.",
            })
            .regex(/^(?=.*\d)/, {
                message: "Password must contain at least 1 number.",
            }),
            phone: z.
            string({ error : "Phone must be string"})
            .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
                message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
            })
            .optional(),
            role: z
            .enum(Object.values(Role) as [string])
            .optional(),
            isActive: z
            .enum(Object.values(IsActive) as [string])
            .optional(),
            isDeleted: z
            .boolean({error : "isDeleted must be true or false"})
            .optional(),
            isBlocked: z
            .enum(Object.values(IsBlocked) as [string]) 
            .optional(),
            isVerified: z
            .boolean({error : "isVerified must be true or false"})
            .optional(),
            address : z
            .string({ error : "Address must be string"})
            .max(200, {message: "Address cannot exceed 2000 characters."})
            .optional()
           

    })



export const updateUserZodSchema = z.object({
            name : z
            .string({ error : "Name must be string"})
            .min(2, {message: "Name  must be at least 2 character long "})
            .max(50, {message: "Name cannot exceed 50 characters."}).optional(),
            password: z
            .string({ error : "Password must be string"})
            .min(6, {message:"must be at least 6 character long"})
            .regex(/^(?=.*[A-Z])/, {
                message: "Password must contain at least 1 upppercase letter. ",
            })
            .regex(/^(?=.*[!@#$%^&*])/, {
                message: "Password must contain at least 1  special character.",
            })
            .regex(/^(?=.*\d)/, {
                message: "Password must contain at least 1 number.",
            }).optional(),
            phone: z.
            string({ error : "Phone must be string"})
            .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
                message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
            })
            .optional(),
            role: z
            .enum(Object.values(Role) as [string])
            .optional(),
            isActive: z
            .enum(Object.values(IsActive) as [string])
            .optional(),
            isBlocked: z
            .enum(Object.values(IsBlocked) as [string]) 
            .optional(),
            isDeleted: z
            .boolean({error : "isDeleted must be true or false"})
            .optional(),
            isVerified: z
            .boolean({error : "isVerified must be true or false"})
            .optional(),
            address : z
            .string({ error : "Address must be string"})
            .max(200, {message: "Address cannot exceed 2000 characters."})
            .optional()
           

    })    