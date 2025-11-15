"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEHICLE_TYPE = exports.IsStatus = exports.availaStatus = void 0;
var availaStatus;
(function (availaStatus) {
    availaStatus["AVAILABLE"] = "AVAILABLE";
    availaStatus["UNAVAILABLE"] = "UNAVAILABLE";
    availaStatus["ON_TRIP"] = "ON_TRIP";
})(availaStatus || (exports.availaStatus = availaStatus = {}));
var IsStatus;
(function (IsStatus) {
    IsStatus["PENDING"] = "PENDING";
    IsStatus["APPROVED"] = "APPROVED";
    IsStatus["REJECTED"] = "REJECTED";
    IsStatus["SUSPEND"] = "SUSPEND";
})(IsStatus || (exports.IsStatus = IsStatus = {}));
var VEHICLE_TYPE;
(function (VEHICLE_TYPE) {
    VEHICLE_TYPE["CAR"] = "CAR";
    VEHICLE_TYPE["BIKE"] = "BIKE";
    VEHICLE_TYPE["VAN"] = "VAN";
})(VEHICLE_TYPE || (exports.VEHICLE_TYPE = VEHICLE_TYPE = {}));
