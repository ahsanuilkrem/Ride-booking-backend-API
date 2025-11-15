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
exports.StatsController = void 0;
const stats_service_1 = require("./stats.service");
const catchAsyncts_1 = require("../../../utils/catchAsyncts");
const sendRespone_1 = require("../../../utils/sendRespone");
const getPublicHomepageStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getPublicHomepageStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Public homepage stats fetched successfully",
        data: stats,
    });
}));
const getRideStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getRideStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Ride stats fetched successfully",
        data: stats,
    });
}));
const getUserStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getUserStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "User stats fetched successfully",
        data: stats,
    });
}));
const getDriverStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getDriverStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Driver stats fetched successfully",
        data: stats,
    });
}));
const getRevenueStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getRevenueStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Revenue stats fetched successfully",
        data: stats,
    });
}));
const getDashboardStats = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield stats_service_1.StatsService.getDashboardStats();
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: stats,
    });
}));
exports.StatsController = {
    getPublicHomepageStats,
    getRideStats,
    getUserStats,
    getDriverStats,
    getRevenueStats,
    getDashboardStats,
};
