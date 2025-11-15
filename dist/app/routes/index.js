"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const ride_route_1 = require("../modules/ride/ride.route");
const driver_route_1 = require("../modules/driver/driver.route");
const stats_route_1 = require("../modules/stats/stats.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        router: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        router: auth_route_1.AuthRouter
    },
    {
        path: "/rides",
        router: ride_route_1.RideRoutes
    },
    {
        path: "/driver",
        router: driver_route_1.DriverRoutes
    },
    {
        path: "/stats",
        router: stats_route_1.StatsRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.router);
});
