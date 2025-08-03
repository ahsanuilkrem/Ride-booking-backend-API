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
const createDriver = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield driver_service_1.driverService.createDriver(req.body);
    (0, sendRespone_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Driver created",
        data: result,
    });
}));
const updateStatus = (0, catchAsyncts_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const driverId = req.params.id;
    const result = yield driver_service_1.driverService.updateStatus(driverId, req.body);
    (0, sendRespone_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Driver status Availability",
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
    updateStatus,
    getAllDriver,
    getEarnings,
};
