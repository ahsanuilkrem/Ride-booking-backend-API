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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.driverService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_interfaces_1 = require("./driver.interfaces");
const driver_model_1 = require("./driver.model");
const QueryBuilder_1 = require("../../../utils/QueryBuilder");
const driver_constant_1 = require("./driver.constant");
const user_model_1 = require("../user/user.model");
const user_interfaces_1 = require("../user/user.interfaces");
const mongoose_1 = __importDefault(require("mongoose"));
const ride_model_1 = require("../ride/ride.model");
const createDriver = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.User.findById(userId);
        if (!user) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
        }
        // if (!user?.phone || !user?.address) {
        //       throw new AppError(httpStatus.BAD_REQUEST, "Please Update Your My Profile ")
        //     }
        const { vehicleNumber } = payload, rest = __rest(payload, ["vehicleNumber"]);
        const isDriverExist = yield driver_model_1.Driver.findOne({ vehicleNumber });
        if (isDriverExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver Alrader Exist");
        }
        const isUserExist = yield driver_model_1.Driver.findOne({ userId: userId });
        if (isUserExist) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "userId alrader Exist");
        }
        const driver = yield driver_model_1.Driver.create(Object.assign({ userId: userId, vehicleNumber }, rest));
        const updateUserRole = yield user_model_1.User.findByIdAndUpdate(userId, { role: user_interfaces_1.Role.DRIVER }, { new: true, runValidators: true, });
        return {
            driver,
            updateUserRole
        };
    }
    catch (error) {
        console.error(error);
    }
});
const toggleAvailability = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    if (!Object.values(driver_interfaces_1.availaStatus).includes(payload.availability)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid availability status");
    }
    const updatedDriver = yield driver_model_1.Driver.findByIdAndUpdate(driverId, payload, {
        new: true,
    });
    return updatedDriver;
});
const updateAvailability = (user, availability) => __awaiter(void 0, void 0, void 0, function* () {
    if (![
        driver_interfaces_1.availaStatus.AVAILABLE,
        driver_interfaces_1.availaStatus.UNAVAILABLE
    ].includes(availability)) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid availability change");
    }
    const driver = yield driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    // if (driver.status !== IsStatus.APPROVED) {
    //   throw new AppError(
    //     httpStatus.BAD_REQUEST,
    //     "Only approved drivers can update availability"
    //   );
    // }
    driver.availability = availability;
    yield driver.save();
    return driver;
});
const updateMyDriverProfile = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    if (payload.vehicleType)
        driver.vehicleType = payload.vehicleType;
    if (payload.vehicleModel)
        driver.vehicleModel = payload.vehicleModel;
    if (payload.vehicleNumber)
        driver.vehicleNumber = payload.vehicleNumber;
    if (payload.licenseNumber)
        driver.licenseNumber = payload.licenseNumber;
    // if (payload.availability) {
    //   if (!Object.values(availaStatus.AVAILABLE).includes(payload.availability)) {
    //     throw new AppError(httpStatus.BAD_REQUEST, "Invalid availability value");
    //   }
    //   driver.availability = payload.availability;
    // }
    if (payload.availability !== undefined) {
        if (!Object.values(driver_interfaces_1.availaStatus).includes(payload.availability)) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Invalid availability value");
        }
        driver.availability = payload.availability;
    }
    yield driver.save();
    return driver;
});
const getMyDriverProfile = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findOne({ userId: user.userId }).populate("userId");
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    return driver;
});
const updateDriverStatus = (driverId, driverStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const driver = yield driver_model_1.Driver.findById(driverId).session(session);
        if (!driver) {
            throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver application not found");
        }
        if (driver.status === driverStatus) {
            throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `Already ${driverStatus}`);
        }
        driver.status = driverStatus;
        if (driverStatus === driver_interfaces_1.IsStatus.APPROVED) {
            driver.approvedAt = new Date();
            // ✅ Update the user's role to DRIVER
            yield user_model_1.User.findByIdAndUpdate(driver.userId, { role: user_interfaces_1.Role.DRIVER }, { session });
        }
        yield driver.save({ session });
        yield session.commitTransaction();
        session.endSession();
        return driver;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const getAllDriver = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const queryBuilder = new QueryBuilder_1.QueryBuilder(driver_model_1.Driver.find(), query);
    const driver = yield queryBuilder
        .search(driver_constant_1.driverSchemaSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate();
    const [data, meta] = yield Promise.all([
        driver.build(),
        queryBuilder.getMeta()
    ]);
    return {
        data,
        meta
    };
});
const getDriverRideHistory = (user, query) => __awaiter(void 0, void 0, void 0, function* () {
    // First verify the driver exists and is approved
    const driver = yield driver_model_1.Driver.findOne({ userId: user.userId });
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver profile not found");
    }
    if (driver.status !== driver_interfaces_1.IsStatus.APPROVED) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "Only approved drivers can view ride history");
    }
    // Create base query for rides where this driver was assigned
    const baseQuery = { driver: driver._id };
    // Apply search filter if searchTerm is provided
    let searchQuery = Object.assign({}, baseQuery);
    if (query.searchTerm) {
        searchQuery = Object.assign(Object.assign({}, baseQuery), { $or: [
                { "pickupAddress": { $regex: query.searchTerm, $options: "i" } },
                {
                    "destinationAddress": {
                        $regex: query.searchTerm,
                        $options: "i",
                    },
                },
                { status: { $regex: query.searchTerm, $options: "i" } },
            ] });
    }
    // Apply additional filters from query parameters
    const filterQuery = Object.assign({}, searchQuery);
    if (query.status) {
        filterQuery.status = query.status;
    }
    if (query.vehicleType) {
        filterQuery.vehicleType = query.vehicleType;
    }
    // Create query builder for rides where this driver was assigned
    const rideQuery = ride_model_1.Ride.find(filterQuery)
        .populate("userId", "name email phone")
        .sort({ createdAt: -1 });
    const queryBuilder = new QueryBuilder_1.QueryBuilder(rideQuery, query);
    // Apply search, filter, sort, and pagination
    const result = yield queryBuilder
        .search(["pickupAddress", "destinationAddress", "status"])
        .filter()
        .sort()
        .fields()
        .paginate();
    // Get total count for the specific driver's rides with applied filters
    const totalDocuments = yield ride_model_1.Ride.countDocuments(filterQuery);
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 5;
    const totalPage = Math.ceil(totalDocuments / limit);
    const meta = {
        page,
        limit,
        total: totalDocuments,
        totalPage,
    };
    const data = yield result.build();
    return {
        data,
        meta,
    };
});
const getDriverEarnings = (driverId) => __awaiter(void 0, void 0, void 0, function* () {
    const driver = yield driver_model_1.Driver.findById(driverId);
    if (!driver) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    return { earnings: driver.earnings };
});
exports.driverService = {
    createDriver,
    toggleAvailability,
    updateAvailability,
    updateMyDriverProfile,
    getMyDriverProfile,
    getDriverEarnings,
    getAllDriver,
    getDriverRideHistory,
    updateDriverStatus,
};
