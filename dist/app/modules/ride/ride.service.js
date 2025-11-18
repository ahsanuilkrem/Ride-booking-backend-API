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
exports.RideService = exports.cancelRide = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const payment_interfaces_1 = require("../payment/payment.interfaces");
const payment_model_1 = require("../payment/payment.model");
const user_model_1 = require("../user/user.model");
const ride_interfaces_1 = require("./ride.interfaces");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ride_model_1 = require("./ride.model");
const mongoose_1 = require("mongoose");
const distance_1 = require("../../../middiewares/distance");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const ride_constant_1 = require("./ride.constant");
const driver_model_1 = require("../driver/driver.model");
const driver_interfaces_1 = require("../driver/driver.interfaces");
const rideStatus_1 = require("./rideStatus");
const getTransactionId = () => {
    return `tran_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
const requestRide = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const transanctionId = getTransactionId();
    const session = yield ride_model_1.Ride.startSession();
    session.startTransaction();
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!(user === null || user === void 0 ? void 0 : user.phone) || !(user === null || user === void 0 ? void 0 : user.address)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Please Update Your My Profile ");
        }
        const ride = yield ride_model_1.Ride.create([Object.assign({ userId: userId, status: ride_interfaces_1.RideStatus.requested, fare: 0 }, payload)], { session });
        const { pickupLocation, destinationLocation } = payload;
        if (!pickupLocation || !destinationLocation) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Pickup and Destination locations are required.");
        }
        const distance = (0, distance_1.calculateDistanceInKm)(pickupLocation.lat, pickupLocation.lng, destinationLocation.lat, destinationLocation.lng);
        const amount = (0, distance_1.calculateFare)(distance);
        const payment = yield payment_model_1.Payment.create([{
                rider: ride[0]._id,
                status: payment_interfaces_1.PAYMENT_STATUS.UNPAID,
                transanctionId: transanctionId,
                amount: amount.toFixed(1),
            }], { session });
        const updateRide = yield ride_model_1.Ride.findByIdAndUpdate(ride[0]._id, {
            payment: payment[0]._id,
            fare: amount.toFixed(1),
        }, { new: true, runValidators: true, session })
            .populate("userId")
            .populate("payment");
        yield session.commitTransaction();
        session.endSession();
        return updateRide;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const cancelRide = (userId, rideId, cancelStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new Error("Ride not found");
    }
    if (ride.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to cancel this ride");
    }
    if ([
        ride_interfaces_1.RideStatus.accepted,
        ride_interfaces_1.RideStatus.completed,
        ride_interfaces_1.RideStatus.picked_up,
        ride_interfaces_1.RideStatus.cancelled_by_driver,
        ride_interfaces_1.RideStatus.in_transit,
    ].includes(ride.status)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Cannot cancel ride because its status is '${ride.status}'`);
    }
    if (ride.status === ride_interfaces_1.RideStatus.cancelled_by_rider) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride is already cancelled");
    }
    const acceptedAt = new Date();
    const now = new Date();
    const diffMs = now.getTime() - acceptedAt.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    if (diffDays > 1) {
        throw new Error("You can only cancel a ride within 1 day of acceptance");
    }
    if (ride.status !== ride_interfaces_1.RideStatus.requested) {
        throw new Error("Ride cannot be cancelled at this stage");
    }
    ride.status = cancelStatus;
    // ride.status = RideStatus.cancelled_by_rider;
    if (!ride.rideTimestamps) {
        ride.rideTimestamps = {};
    }
    ride.rideTimestamps.cancelledAt = now;
    yield ride.save();
    return ride;
});
exports.cancelRide = cancelRide;
const getRideMyHistory = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find({ userId: userId, }), query);
    const rides = yield queryBuilder
        .search(ride_constant_1.riderSchemaSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        rides.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data: data,
        meta: meta,
    };
});
const getRideById = (userId, rideId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const ride = yield ride_model_1.Ride.findById(rideId);
    if (!ride) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
    }
    if (ride.userId.toString() !== userId) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "You are not authorized to view this ride");
    }
    return ride;
});
const getAllRides = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const queryBuilder = new QueryBuilder_1.QueryBuilder(ride_model_1.Ride.find(), query);
    const ridesQuery = queryBuilder
        .search(ride_constant_1.riderSchemaSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        ridesQuery.build(),
        queryBuilder.getMeta(),
    ]);
    return {
        data,
        meta,
    };
});
const validTransitions = {
    requested: [ride_interfaces_1.RideStatus.accepted, ride_interfaces_1.RideStatus.cancelled_by_driver, ride_interfaces_1.RideStatus.no_driver_available],
    accepted: [ride_interfaces_1.RideStatus.picked_up, ride_interfaces_1.RideStatus.cancelled_by_driver],
    picked_up: [ride_interfaces_1.RideStatus.in_transit],
    in_transit: [ride_interfaces_1.RideStatus.completed],
    completed: [],
    cancelled_by_rider: [],
    cancelled_by_driver: [],
    no_driver_available: [],
};
// Status -> timestamp mapping
const updateRideStatus = (userId, rideId, newStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield ride_model_1.Ride.startSession();
    try {
        session.startTransaction();
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        const ride = yield ride_model_1.Ride.findById(rideId);
        if (!ride) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Ride not found");
        }
        const driver = yield driver_model_1.Driver.findOne({ userId });
        if (!driver) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver profile not found");
        }
        // Reject based on driver status
        if (driver.status === undefined) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver status missing");
        }
        if ([
            driver_interfaces_1.IsStatus.PENDING,
            driver_interfaces_1.IsStatus.REJECTED,
            driver_interfaces_1.IsStatus.SUSPEND,
        ].includes(driver.status)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Your driver status is '${driver.status}', you cannot update rides`);
        }
        if (driver.availability === driver_interfaces_1.availaStatus.UNAVAILABLE) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You are currently offline");
        }
        // ✅ Vehicle type check
        // if (driver.vehicleType !== ride.vehicleType) {
        //   throw new AppError(
        //     httpStatus.BAD_REQUEST,
        //     `Vehicle type mismatch. You are registered with '${driver.vehicleType}', but this ride requires '${ride.vehicleType}'.`
        //   );
        // }
        // ✅ Prevent driver from accepting multiple active rides
        if (newStatus === ride_interfaces_1.RideStatus.accepted) {
            const alreadyActiveRide = yield ride_model_1.Ride.findOne({
                userId: userId,
                status: { $in: rideStatus_1.ACTIVE_RIDE_STATUSES },
            });
            if (alreadyActiveRide) {
                throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "You already have an active ride");
            }
        }
        if (newStatus === ride_interfaces_1.RideStatus.cancelled_by_driver) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Drivers cannot cancel rides");
        }
        if (ride.status === ride_interfaces_1.RideStatus.cancelled_by_rider) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Ride has already been cancelled");
        }
        // ⛔ Prevent invalid transitions
        const allowedNextStatuses = rideStatus_1.rideStatusFlow[ride.status];
        // if (!allowedNextStatuses.includes(newStatus)) {
        //   throw new AppError(
        //     httpStatus.BAD_REQUEST,
        //     `Invalid ride status transition from '${ride.status}' to '${newStatus}'`
        //   );
        // }
        if (!allowedNextStatuses.includes(newStatus)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Invalid ride status transition from '${ride.status}' to '${newStatus}'.\n` +
                `Ride status must follow this flow:\n${(0, rideStatus_1.getFullRideStatusFlow)()}`);
        }
        // ⛔ Only assigned driver can update ride after acceptance
        // if (
        //   ride.driver &&
        //   ride.driver.toString() !== userId &&
        //   [
        //     RideStatus.accepted,
        //     RideStatus.picked_up,
        //     RideStatus.in_transit,
        //   ].includes(ride.status)
        // ) {
        //   throw new AppError(
        //     httpStatus.FORBIDDEN,
        //     "You are not assigned to this ride"
        //   );
        // }
        // Timestamp mapping
        const now = new Date();
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
        const updateData = {
            status: newStatus, rideTimestamps: Object.assign(Object.assign({}, ride.rideTimestamps), { [statusToTimestampField[newStatus]]: now }),
        };
        // ✅ Assign driver on first accept
        if (!ride.driver && newStatus === ride_interfaces_1.RideStatus.accepted) {
            updateData.driver = new mongoose_1.Types.ObjectId(userId);
        }
        // ✅ Add fare to earnings on completion
        if (newStatus === ride_interfaces_1.RideStatus.completed && ride.fare && driver) {
            yield driver_model_1.Driver.updateOne({ userId }, { $inc: { earnings: ride.fare } }, { session });
        }
        const updatedRide = yield ride_model_1.Ride.findByIdAndUpdate(rideId, updateData, {
            new: true,
            session,
        });
        yield session.commitTransaction();
        session.endSession();
        return updatedRide;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const viewEarningHistory = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const driver = yield driver_model_1.Driver.findOne({ userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    const completedRides = yield ride_model_1.Ride.find({
        driver: driver._id,
        status: ride_interfaces_1.RideStatus.completed,
    }).sort({ "timestamps.completedAt": -1 }); // Most recent first
    const totalEarnings = completedRides.reduce((acc, ride) => acc + (ride.fare || 0), 0);
    return {
        totalRides: completedRides.length,
        totalEarnings,
        rides: completedRides,
    };
});
exports.RideService = {
    requestRide,
    cancelRide: exports.cancelRide,
    getRideMyHistory,
    getRideById,
    getAllRides,
    updateRideStatus,
    viewEarningHistory
};
