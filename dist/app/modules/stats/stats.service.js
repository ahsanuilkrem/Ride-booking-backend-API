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
exports.StatsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ride_model_1 = require("../ride/ride.model");
const user_model_1 = require("../user/user.model");
const driver_model_1 = require("../driver/driver.model");
const ride_interfaces_1 = require("../ride/ride.interfaces");
const driver_interfaces_1 = require("../driver/driver.interfaces");
const user_interfaces_1 = require("../user/user.interfaces");
const now = new Date();
const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const currentYear = new Date(now.getFullYear(), 0, 1);
// Public, non-sensitive homepage stats (safe to expose without auth)
const getPublicHomepageStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalCompletedRides, totalApprovedDrivers, totalRiders, coverageLocationsCount, topPickupLocations,] = yield Promise.all([
        ride_model_1.Ride.countDocuments({ status: ride_interfaces_1.RideStatus.completed }),
        driver_model_1.Driver.countDocuments({ status: driver_interfaces_1.IsStatus.APPROVED }),
        user_model_1.User.countDocuments({ role: user_interfaces_1.Role.RIDER }),
        ride_model_1.Ride.distinct("pickupLocation.name").then((names) => names.length),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$pickupLocation.name", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
        ]),
    ]);
    return {
        totalCompletedRides,
        totalApprovedDrivers,
        totalRiders,
        coverageLocationsCount,
        vehicleTypesOffered: Object.values(driver_interfaces_1.VEHICLE_TYPE),
        topPickupLocations,
    };
});
// Dashboard Stats - Overview of all key metrics
const getDashboardStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, totalRides, totalDrivers, totalRevenue, activeRides, completedRidesToday, newUsersThisWeek, newDriversThisWeek,] = yield Promise.all([
        user_model_1.User.countDocuments(),
        ride_model_1.Ride.countDocuments(),
        driver_model_1.Driver.countDocuments(),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.countDocuments({
            status: {
                $in: [ride_interfaces_1.RideStatus.accepted, ride_interfaces_1.RideStatus.picked_up, ride_interfaces_1.RideStatus.in_transit],
            },
        }),
        ride_model_1.Ride.countDocuments({
            status: ride_interfaces_1.RideStatus.completed,
            "timestamps.completedAt": {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            },
        }),
        user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
    ]);
    return {
        overview: {
            totalUsers,
            totalRides,
            totalDrivers,
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            activeRides,
            completedRidesToday,
            newUsersThisWeek,
            newDriversThisWeek,
        },
    };
});
// User Statistics
const getUserStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalUsers, totalRiders, totalDrivers, totalAdmins, activeUsers, blockedUsers, suspendedUsers, newUsersLast7Days, newUsersLast30Days, usersByRole, usersByStatus, verifiedUsers, unverifiedUsers,] = yield Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({ role: user_interfaces_1.Role.RIDER }),
        user_model_1.User.countDocuments({ role: user_interfaces_1.Role.DRIVER }),
        user_model_1.User.countDocuments({ role: { $in: [user_interfaces_1.Role.ADMIN] } }),
        user_model_1.User.countDocuments({ isActive: user_interfaces_1.IsActive.ACTIVE }),
        user_model_1.User.countDocuments({ isActive: user_interfaces_1.IsActive.INACTIVE }),
        user_model_1.User.countDocuments({ isActive: user_interfaces_1.IsActive.BLOCKED }),
        user_model_1.User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        user_model_1.User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        user_model_1.User.aggregate([
            { $group: { _id: "$role", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        user_model_1.User.aggregate([
            { $group: { _id: "$isActive", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        user_model_1.User.countDocuments({ isVerified: true }),
        user_model_1.User.countDocuments({ isVerified: false }),
    ]);
    return {
        totalUsers,
        totalRiders,
        totalDrivers,
        totalAdmins,
        activeUsers,
        blockedUsers,
        suspendedUsers,
        newUsersLast7Days,
        newUsersLast30Days,
        usersByRole,
        usersByStatus,
        verifiedUsers,
        unverifiedUsers,
    };
});
// Driver Statistics
const getDriverStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalDrivers, approvedDrivers, pendingDrivers, rejectedDrivers, suspendedDrivers, availableDrivers, unavailableDrivers, onTripDrivers, driversByVehicleType, driversByStatus, driversByAvailability, totalEarnings, avgEarnings, newDriversLast7Days, newDriversLast30Days, topEarningDrivers,] = yield Promise.all([
        driver_model_1.Driver.countDocuments(),
        driver_model_1.Driver.countDocuments({ status: driver_interfaces_1.IsStatus.APPROVED }),
        driver_model_1.Driver.countDocuments({ status: driver_interfaces_1.IsStatus.PENDING }),
        driver_model_1.Driver.countDocuments({ status: driver_interfaces_1.IsStatus.REJECTED }),
        driver_model_1.Driver.countDocuments({ status: driver_interfaces_1.IsStatus.SUSPEND }),
        driver_model_1.Driver.countDocuments({ availability: driver_interfaces_1.availaStatus.AVAILABLE }),
        driver_model_1.Driver.countDocuments({ availability: driver_interfaces_1.availaStatus.UNAVAILABLE }),
        driver_model_1.Driver.countDocuments({ availability: driver_interfaces_1.availaStatus.ON_TRIP }),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: "$availability", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        driver_model_1.Driver.aggregate([
            { $group: { _id: null, total: { $sum: "$earnings" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        driver_model_1.Driver.aggregate([
            { $group: { _id: null, avg: { $avg: "$earnings" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avg) || 0; }),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: sevenDaysAgo } }),
        driver_model_1.Driver.countDocuments({ appliedAt: { $gte: thirtyDaysAgo } }),
        driver_model_1.Driver.aggregate([
            { $sort: { earnings: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    driverName: "$user.name",
                    vehicleType: 1,
                    vehicleModel: 1,
                    earnings: 1,
                    status: 1,
                },
            },
        ]),
    ]);
    return {
        totalDrivers,
        approvedDrivers,
        pendingDrivers,
        rejectedDrivers,
        suspendedDrivers,
        availableDrivers,
        unavailableDrivers,
        onTripDrivers,
        driversByVehicleType,
        driversByStatus,
        driversByAvailability,
        totalEarnings: Math.round(totalEarnings * 100) / 100,
        avgEarnings: Math.round(avgEarnings * 100) / 100,
        newDriversLast7Days,
        newDriversLast30Days,
        topEarningDrivers,
    };
});
// Ride Statistics
const getRideStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalRides, ridesByStatus, ridesByVehicleType, totalDistance, avgDistance, totalFare, avgFare, ridesLast7Days, ridesLast30Days, ridesThisMonth, ridesThisYear, completedRides, cancelledRides, activeRides, ridesByHour, topPickupLocations, topDestinationLocations, avgRideDuration,] = yield Promise.all([
        ride_model_1.Ride.countDocuments(),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$vehicleType", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: null, total: { $sum: "$distance" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            { $group: { _id: null, avg: { $avg: "$distance" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avg) || 0; }),
        ride_model_1.Ride.aggregate([{ $group: { _id: null, total: { $sum: "$fare" } } }]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([{ $group: { _id: null, avg: { $avg: "$fare" } } }]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avg) || 0; }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: currentMonth } }),
        ride_model_1.Ride.countDocuments({ createdAt: { $gte: currentYear } }),
        ride_model_1.Ride.countDocuments({ status: ride_interfaces_1.RideStatus.completed }),
        ride_model_1.Ride.countDocuments({ status: ride_interfaces_1.RideStatus.completed }),
        ride_model_1.Ride.countDocuments({
            status: {
                $in: [ride_interfaces_1.RideStatus.accepted, ride_interfaces_1.RideStatus.picked_up, ride_interfaces_1.RideStatus.in_transit],
            },
        }),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: { $hour: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: "$pickupLocation.name",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            {
                $group: {
                    _id: "$destinationLocation.name",
                    count: { $sum: 1 },
                },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            {
                $addFields: {
                    duration: {
                        $divide: [
                            {
                                $subtract: [
                                    "$timestamps.completedAt",
                                    "$timestamps.requestedAt",
                                ],
                            },
                            1000 * 60, // Convert to minutes
                        ],
                    },
                },
            },
            { $group: { _id: null, avgDuration: { $avg: "$duration" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avgDuration) || 0; }),
    ]);
    return {
        totalRides,
        ridesByStatus,
        ridesByVehicleType,
        totalDistance: Math.round(totalDistance * 100) / 100,
        avgDistance: Math.round(avgDistance * 100) / 100,
        totalFare: Math.round(totalFare * 100) / 100,
        avgFare: Math.round(avgFare * 100) / 100,
        ridesLast7Days,
        ridesLast30Days,
        ridesThisMonth,
        ridesThisYear,
        completedRides,
        cancelledRides,
        activeRides,
        ridesByHour,
        topPickupLocations,
        topDestinationLocations,
        avgRideDuration: Math.round(avgRideDuration * 100) / 100,
    };
});
// Revenue Statistics
const getRevenueStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const [totalRevenue, revenueThisMonth, revenueThisYear, revenueLast7Days, revenueLast30Days, avgRevenuePerRide, revenueByVehicleType, revenueByStatus, revenueByHour, revenueByDay, topRevenueLocations, cancellationRevenueLoss, pendingRevenue,] = yield Promise.all([
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interfaces_1.RideStatus.completed,
                    "timestamps.completedAt": { $gte: currentMonth },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interfaces_1.RideStatus.completed,
                    "timestamps.completedAt": { $gte: currentYear },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interfaces_1.RideStatus.completed,
                    "timestamps.completedAt": { $gte: sevenDaysAgo },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: ride_interfaces_1.RideStatus.completed,
                    "timestamps.completedAt": { $gte: thirtyDaysAgo },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            { $group: { _id: null, avg: { $avg: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.avg) || 0; }),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            { $group: { _id: "$vehicleType", total: { $sum: "$fare" } } },
            { $sort: { total: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $group: { _id: "$status", total: { $sum: "$fare" } } },
            { $sort: { total: -1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            {
                $group: {
                    _id: { $hour: "$timestamps.completedAt" },
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            {
                $group: {
                    _id: { $dayOfWeek: "$timestamps.completedAt" },
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { _id: 1 } },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            {
                $group: {
                    _id: "$destinationLocation.name",
                    total: { $sum: "$fare" },
                },
            },
            { $sort: { total: -1 } },
            { $limit: 10 },
        ]),
        ride_model_1.Ride.aggregate([
            { $match: { status: ride_interfaces_1.RideStatus.completed } },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
        ride_model_1.Ride.aggregate([
            {
                $match: {
                    status: {
                        $in: [
                            ride_interfaces_1.RideStatus.accepted,
                            ride_interfaces_1.RideStatus.picked_up,
                            ride_interfaces_1.RideStatus.in_transit,
                        ],
                    },
                },
            },
            { $group: { _id: null, total: { $sum: "$fare" } } },
        ]).then((result) => { var _a; return ((_a = result[0]) === null || _a === void 0 ? void 0 : _a.total) || 0; }),
    ]);
    return {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
        revenueThisYear: Math.round(revenueThisYear * 100) / 100,
        revenueLast7Days: Math.round(revenueLast7Days * 100) / 100,
        revenueLast30Days: Math.round(revenueLast30Days * 100) / 100,
        avgRevenuePerRide: Math.round(avgRevenuePerRide * 100) / 100,
        revenueByVehicleType,
        revenueByStatus,
        revenueByHour,
        revenueByDay,
        topRevenueLocations,
        cancellationRevenueLoss: Math.round(cancellationRevenueLoss * 100) / 100,
        pendingRevenue: Math.round(pendingRevenue * 100) / 100,
    };
});
exports.StatsService = {
    getDashboardStats,
    getRideStats,
    getUserStats,
    getDriverStats,
    getRevenueStats,
    getPublicHomepageStats,
};
