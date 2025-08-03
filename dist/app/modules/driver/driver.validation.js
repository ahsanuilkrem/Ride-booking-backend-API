"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverSchema = exports.createDriverSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const driver_interfaces_1 = require("./driver.interfaces");
exports.createDriverSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." }),
    location: zod_1.default
        .string({ error: "location must be string" }),
    phone: zod_1.default.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    }),
    vehicleNumber: zod_1.default
        .string({ error: "licensePlate must be string" }),
    availability: zod_1.default
        .enum(Object.values(driver_interfaces_1.availaStatus))
        .optional(),
    status: zod_1.default
        .enum(Object.values(driver_interfaces_1.IsStatus))
        .optional(),
    earnings: zod_1.default
        .number({ error: "earnings must be number" })
        .optional(),
    rides: zod_1.default
        .string()
        .optional(),
});
exports.updateDriverSchema = zod_1.default.object({
    name: zod_1.default
        .string({ error: "Name must be string" })
        .min(2, { message: "Name  must be at least 2 character long " })
        .max(50, { message: "Name cannot exceed 50 characters." })
        .optional(),
    location: zod_1.default
        .string({ error: "location must be string" })
        .optional(),
    phone: zod_1.default.
        string({ error: "Phone must be string" })
        .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
        message: "Phone number must be valid for Bangladesh. Format: +8801xxxxxxxxx or 01xxxxxxxxx",
    })
        .optional(),
    vehicleNumber: zod_1.default
        .string({ error: "licensePlate must be string" })
        .optional(),
    availability: zod_1.default
        .enum(Object.values(driver_interfaces_1.availaStatus))
        .optional(),
    status: zod_1.default
        .enum(Object.values(driver_interfaces_1.IsStatus))
        .optional(),
    earnings: zod_1.default
        .number({ error: "earnings must be number" })
        .optional(),
});
