"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateFare = exports.calculateDistanceInKm = void 0;
const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // Radius of Earth in KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
exports.calculateDistanceInKm = calculateDistanceInKm;
const calculateFare = (distanceKm) => {
    const baseFare = 15; // For first 2 km
    const perKmRate = 10; // For every km after 2 km
    if (distanceKm <= 2)
        return baseFare;
    // return baseFare + (distanceKm - 2) * perKmRate;
    const fare = baseFare + (distanceKm - 2) * perKmRate;
    return Math.max(0, Number(fare.toFixed(2)));
};
exports.calculateFare = calculateFare;
