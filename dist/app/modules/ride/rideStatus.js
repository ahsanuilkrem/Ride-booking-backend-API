"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullRideStatusFlow = exports.rideStatusFlow = exports.ACTIVE_RIDE_STATUSES = void 0;
const ride_interfaces_1 = require("./ride.interfaces");
exports.ACTIVE_RIDE_STATUSES = [
    ride_interfaces_1.RideStatus.cancelled_by_driver,
    ride_interfaces_1.RideStatus.accepted,
    ride_interfaces_1.RideStatus.picked_up,
    ride_interfaces_1.RideStatus.in_transit,
];
exports.rideStatusFlow = {
    [ride_interfaces_1.RideStatus.requested]: [ride_interfaces_1.RideStatus.accepted, ride_interfaces_1.RideStatus.cancelled_by_driver],
    [ride_interfaces_1.RideStatus.accepted]: [ride_interfaces_1.RideStatus.picked_up],
    [ride_interfaces_1.RideStatus.picked_up]: [ride_interfaces_1.RideStatus.in_transit],
    [ride_interfaces_1.RideStatus.in_transit]: [ride_interfaces_1.RideStatus.completed],
    [ride_interfaces_1.RideStatus.completed]: [],
    [ride_interfaces_1.RideStatus.cancelled_by_driver]: [],
    [ride_interfaces_1.RideStatus.cancelled_by_rider]: [],
    [ride_interfaces_1.RideStatus.no_driver_available]: []
};
const getFullRideStatusFlow = () => {
    var _a;
    const flow = [];
    let current = ride_interfaces_1.RideStatus.requested;
    const visited = new Set();
    while (current && !visited.has(current)) {
        flow.push(current);
        visited.add(current);
        current = (_a = exports.rideStatusFlow[current]) === null || _a === void 0 ? void 0 : _a[0]; // Only follow the primary path
    }
    return flow.join(" → ");
};
exports.getFullRideStatusFlow = getFullRideStatusFlow;
