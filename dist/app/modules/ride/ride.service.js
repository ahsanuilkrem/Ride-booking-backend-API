"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideService = void 0;
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const ride_model_1 = require("./ride.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const requestRide = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.rider) {
        throw new Error("Rider information is missing.");
    }
    const existingActiveRide = yield ride_model_1.Ride.findOne({
        rider: payload.rider,
        status: { $in: ["requested", "accepted", "picked_up", "in_transit"] },
    });
    if (existingActiveRide) {
        throw new Error("You already have an active ride in progress.");
    }
    const ride = yield ride_model_1.Ride.create(payload);
    return ride;
});
const cancelRide = (rideId, riderId) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findOne({ _id: rideId, rider: riderId });
    if (!ride) {
        throw new Error("Ride not found or you are not authorized");
    }
    const requestedAt = ride.timestamps.requestedAt;
    const now = new Date();
    const diffMs = now.getTime() - requestedAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 1) {
        throw new Error("You can cancel ride only within 1 day of request");
    }
    if (ride.status !== "requested") {
        throw new Error("Ride cannot be cancelled at this stage");
    }
    ride.status = "cancelled_by_rider";
    ride.timestamps.cancelledAt = now;
    yield ride.save();
    return ride;
});
const getRideMyHistory = (riderId_1, ...args_1) => __awaiter(void 0, [riderId_1, ...args_1], void 0, function* (riderId, limit = 10) {
    const rides = yield ride_model_1.Ride.find({ rider: riderId })
        .sort({ createdAt: -1 })
        .limit(limit);
    return rides;
});
const getAllRides = () => __awaiter(void 0, void 0, void 0, function* () {
    const rides = yield ride_model_1.Ride.find()
        .populate("rider", "name email")
        .sort({ createdAt: -1 });
    const totalUsers = yield ride_model_1.Ride.countDocuments();
    return {
        data: rides,
        meta: {
            total: totalUsers
        }
    };
});
const validTransitions = {
    requested: ["accepted", "cancelled_by_driver", "no_driver_available"],
    accepted: ["picked_up", "cancelled_by_driver"],
    picked_up: ["in_transit"],
    in_transit: ["completed"],
    completed: [],
    cancelled_by_rider: [],
    cancelled_by_driver: [],
    no_driver_available: [],
};
const statusToTimestampField = {
    requested: "requestedAt",
    accepted: "acceptedAt",
    picked_up: "pickedUpAt",
    in_transit: "inTransitAt",
    completed: "completedAt",
    cancelled_by_driver: "cancelledAt",
    cancelled_by_rider: "cancelledAt",
    no_driver_available: "cancelledAt",
};
const updateRideStatus = (rideId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    const currentStatus = ride.status;
    const allowedNextStatuses = validTransitions[currentStatus];
    if (!allowedNextStatuses.includes(newStatus)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid status transition from '${currentStatus}' to '${newStatus}'`);
    }
    ride.status = newStatus;
    const timestampField = statusToTimestampField[newStatus];
    if (timestampField) {
        ride.timestamps[timestampField] = new Date();
    }
    yield ride.save();
    return ride;
});
exports.RideService = {
    requestRide,
    cancelRide,
    getRideMyHistory,
    getAllRides,
    updateRideStatus
};
