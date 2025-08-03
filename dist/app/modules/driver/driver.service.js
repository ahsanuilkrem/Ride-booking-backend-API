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
const AppError_1 = __importDefault(require("../../../errorHelpers/AppError"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const driver_model_1 = require("./driver.model");
const createDriver = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleNumber } = payload, rest = __rest(payload, ["vehicleNumber"]);
    const isUserExist = yield driver_model_1.Driver.findOne({ vehicleNumber });
    if (isUserExist) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Driver Alrader Exist");
    }
    const driver = yield driver_model_1.Driver.create(Object.assign({ vehicleNumber }, rest));
    return driver;
});
const updateStatus = (driverId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const drivers = yield driver_model_1.Driver.findById(driverId);
    if (!drivers) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Driver not found");
    }
    const newUpdateStatus = yield driver_model_1.Driver.findByIdAndUpdate(driverId, payload, { new: true, });
    return newUpdateStatus;
});
const getAllDriver = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = query;
    const driver = yield driver_model_1.Driver.find(filter);
    const totalDriver = yield driver_model_1.Driver.countDocuments();
    return {
        meta: {
            total: totalDriver
        },
        data: driver,
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
    updateStatus,
    getAllDriver,
    getDriverEarnings,
};
