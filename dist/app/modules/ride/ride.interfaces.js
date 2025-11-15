"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideStatus = exports.VehicleType = exports.paymentMethod = void 0;
;
var paymentMethod;
(function (paymentMethod) {
    paymentMethod["cash"] = "cash";
    paymentMethod["card"] = "card";
})(paymentMethod || (exports.paymentMethod = paymentMethod = {}));
var VehicleType;
(function (VehicleType) {
    VehicleType["CAR"] = "CAR";
    VehicleType["BIKE"] = "BIKE";
})(VehicleType || (exports.VehicleType = VehicleType = {}));
var RideStatus;
(function (RideStatus) {
    RideStatus["requested"] = "requested";
    RideStatus["accepted"] = "accepted";
    RideStatus["picked_up"] = "picked_up";
    RideStatus["in_transit"] = "in_transit";
    RideStatus["completed"] = "completed";
    RideStatus["cancelled_by_rider"] = "cancelled_by_rider";
    RideStatus["cancelled_by_driver"] = "cancelled_by_driver";
    RideStatus["no_driver_available"] = "no_driver_available";
})(RideStatus || (exports.RideStatus = RideStatus = {}));
