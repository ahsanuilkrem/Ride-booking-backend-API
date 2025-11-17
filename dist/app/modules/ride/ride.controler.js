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
exports.rideControler = void 0;
const catchAsyncts_1 = require("../../../utils/catchAsyncts");
const sendRespone_1 = require("../../../utils/sendRespone");
const ride_service_1 = require("./ride.service");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const requestRide = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decodeToken = req.user;
    const ride = yield ride_service_1.RideService.requestRide(req.body, decodeToken.userId);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Ride requested successfully!",
        data: ride,
    });
}));
const cancelRide = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const riderId = req.user.user;
    const ride = yield ride_service_1.RideService.cancelRide(riderId);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride cancelled successfully",
        data: ride,
    });
}));
const getRideMyHistory = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const result = yield ride_service_1.RideService.getRideMyHistory(decodedToken.userId, query);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride history fetched successfully",
        data: result.data,
        meta: result.meta
    });
}));
const getAllRides = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const decodedToken = req.user;
    const rides = yield ride_service_1.RideService.getAllRides(decodedToken.userId, query);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "All rides fetched successfully",
        data: rides.data,
        meta: rides.meta
    });
}));
const updateRideStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { rideId } = req.params;
    const decodedToken = req.user;
    const { rideStatus } = req.body;
    const result = yield ride_service_1.RideService.updateRideStatus(decodedToken.userId, rideId, rideStatus);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride status updated successfully",
        data: result,
    });
});
const viewEarningHistory = (0, catchAsyncts_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const decodedToken = req.user;
    const result = yield ride_service_1.RideService.viewEarningHistory(decodedToken.userId);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: http_status_codes_1.default.OK,
        success: true,
        message: "Driver Earning History has been retrieve successfully",
        data: result,
    });
}));
exports.rideControler = {
    requestRide,
    cancelRide,
    getRideMyHistory,
    getAllRides,
    updateRideStatus,
    viewEarningHistory,
};
