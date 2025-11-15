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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverControler = void 0;
const catchAsyncts_1 = require("../../../utils/catchAsyncts");
const sendRespone_1 = require("../../../utils/sendRespone");
const driver_service_1 = require("./driver.service");
const http_status_codes_1 = require("http-status-codes");
const createDriver = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const result = yield driver_service_1.driverService.createDriver(req.body, decodeToken.userId);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Driver created",
        data: result,
    });
}));
const getAllDriver = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const result = yield driver_service_1.driverService.getAllDriver(query);
    (0, sendRespone_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Driver All fetched successfully",
        data: result.data,
        meta: result.meta
    });
}));
const updateDriverStatus = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { driverId } = req.params;
    const { driverStatus } = req.body;
    // console.log("driverId", req.params)
    const result = yield driver_service_1.driverService.updateDriverStatus(driverId, driverStatus);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: `Driver status updated to ${driverStatus}`,
        data: result,
    });
}));
const updateMyDriverProfile = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const payload = req.body;
    const result = yield driver_service_1.driverService.updateMyDriverProfile(user, payload);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Driver profile updated successfully",
        data: result,
    });
}));
const getMyDriverProfile = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const result = yield driver_service_1.driverService.getMyDriverProfile(user);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Driver profile fetched successfully",
        data: result,
    });
}));
const toggleAvailability = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const { availability } = req.body;
    const result = yield driver_service_1.driverService.toggleAvailability(driverId, { availability });
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Availability status updated successfully",
        data: result,
    });
}));
const updateAvailability = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { availability } = req.body;
    const result = yield driver_service_1.driverService.updateAvailability(user, availability);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Driver availability updated successfully",
        data: result,
    });
}));
const getDriverRideHistory = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const query = req.query;
    const result = yield driver_service_1.driverService.getDriverRideHistory(user, query);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.StatusCodes.OK,
        success: true,
        message: "Driver ride history fetched successfully",
        data: result,
    });
}));
const getEarnings = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.driverService.getDriverEarnings(req.params.id);
    (0, sendRespone_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Driver All earning successfully",
        data: result,
    });
}));
exports.DriverControler = {
    createDriver,
    updateDriverStatus,
    getAllDriver,
    updateMyDriverProfile,
    getMyDriverProfile,
    getDriverRideHistory,
    // updateStatus,
    toggleAvailability,
    updateAvailability,
    getEarnings,
};
