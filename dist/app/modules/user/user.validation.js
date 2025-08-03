"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserZodSchema = exports.creatUserZodSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const user_interfaces_1 = require("./user.interfaces");
exports.creatUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    email: zod_1.default
        .string({ error: "Email must be string" })
        .email({ message: " Invelid email address format." })
        .min(5, { message: "Email must be at least 5 character long" })
        .max(50, { message: "Email cannot exceed 50 characters." }),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(6, { message: "must be at least 6 character long" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 upppercase letter. ",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1  special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }),
    phone: zod_1.default.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interfaces_1.Role))
        .optional(),
    isActive: zod_1.default
        .enum(Object.values(user_interfaces_1.IsActive))
        .optional(),
    isDeleted: zod_1.default
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isBlocked: zod_1.default
        .enum(Object.values(user_interfaces_1.IsBlocked))
        .optional(),
    isVerified: zod_1.default
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 2000 characters." })
        .optional()
});
exports.updateUserZodSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." }).optional(),
    password: zod_1.default
        .string({ error: "Password must be string" })
        .min(6, { message: "must be at least 6 character long" })
        .regex(/^(?=.*[A-Z])/, {
        message: "Password must contain at least 1 upppercase letter. ",
    })
        .regex(/^(?=.*[!@#$%^&*])/, {
        message: "Password must contain at least 1  special character.",
    })
        .regex(/^(?=.*\d)/, {
        message: "Password must contain at least 1 number.",
    }).optional(),
    phone: zod_1.default.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    role: zod_1.default
        .enum(Object.values(user_interfaces_1.Role))
        .optional(),
    isActive: zod_1.default
        .enum(Object.values(user_interfaces_1.IsActive))
        .optional(),
    isBlocked: zod_1.default
        .enum(Object.values(user_interfaces_1.IsBlocked))
        .optional(),
    isDeleted: zod_1.default
        .boolean({ error: "isDeleted must be true or false" })
        .optional(),
    isVerified: zod_1.default
        .boolean({ error: "isVerified must be true or false" })
        .optional(),
    address: zod_1.default
        .string({ error: "Address must be string" })
        .max(200, { message: "Address cannot exceed 2000 characters." })
        .optional()
});
