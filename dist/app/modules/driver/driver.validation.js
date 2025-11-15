"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDriverStatusZodSchema = exports.updateAvailabilityZodSchema = exports.updateMyDriverProfileZodSchema = exports.updateDriverSchema = exports.createDriverSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const driver_interfaces_1 = require("./driver.interfaces");
exports.createDriverSchema = zod_1.default.object({
    name: zod_1.default.string().optional(),
    phone: zod_1.default.string().optional(),
    addres: zod_1.default.string().optional(),
    vehicleType: zod_1.default.string({ error: "Vehicle type is required" }),
    vehicleModel: zod_1.default.string({ error: "Vehicle model is required" }),
    licenseNumber: zod_1.default.string({ error: "License number is required" }),
    vehicleNumber: zod_1.default
        .string({ error: "vehicle Number must be string" }),
    availability: zod_1.default
        .enum(Object.values(driver_interfaces_1.availaStatus))
        .optional(),
    status: zod_1.default
        .enum(Object.values(driver_interfaces_1.IsStatus))
        .optional(),
    earnings: zod_1.default
        .number({ error: "earnings must be number" })
        .optional(),
    riderId: zod_1.default
        .string()
        .optional(),
    userId: zod_1.default
        .string()
        .optional(),
});
exports.updateDriverSchema = zod_1.default.object({
    vehicleType: zod_1.default.string({ error: "Vehicle type is required" }),
    vehicleModel: zod_1.default.string({ error: "Vehicle model is required" }),
    licenseNumber: zod_1.default.string({ error: "License number is required" }),
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
exports.updateMyDriverProfileZodSchema = zod_1.default.object({
    vehicleType: zod_1.default.enum(driver_interfaces_1.VEHICLE_TYPE).optional(),
    vehicleModel: zod_1.default.string().min(1).optional(),
    vehicleNumber: zod_1.default.string().min(1).optional(),
    licenseNumber: zod_1.default.string().min(1).optional(),
    availability: zod_1.default.enum(driver_interfaces_1.availaStatus).optional(),
});
exports.updateAvailabilityZodSchema = zod_1.default.object({
    availability: zod_1.default
        .enum(Object.values(driver_interfaces_1.availaStatus))
});
exports.updateDriverStatusZodSchema = zod_1.default.object({
    status: zod_1.default.enum(Object.values(driver_interfaces_1.IsStatus), {
        error: "Driver status is required",
    }),
});
