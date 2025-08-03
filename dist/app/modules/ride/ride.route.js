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
exports.RideRoutes = void 0;
const express_1 = require("express");
const ride_controler_1 = require("./ride.controler");
const ride_validation_1 = require("./ride.validation");
const checkAuth_1 = require("../../../middiewares/checkAuth");
const user_interfaces_1 = require("../user/user.interfaces");
const validateRequest = (zodSchema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield zodSchema.parseAsync(req.body);
        next();
    }
    catch (error) {
        next(error);
    }
});
const router = (0, express_1.Router)();
router.post("/request", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.RIDER), validateRequest(ride_validation_1.requestRideSchema), ride_controler_1.rideControler.requestRide);
router.patch("/cancel/:id", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.RIDER), ride_controler_1.rideControler.cancelRide);
router.get("/myHistory", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.RIDER), ride_controler_1.rideControler.getRideMyHistory);
router.get("/allRides", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.DRIVER), ride_controler_1.rideControler.getAllRides);
router.patch("/updateStatus/:id", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.DRIVER), ride_controler_1.rideControler.updateRideStatus);
exports.RideRoutes = router;
