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
exports.DriverRoutes = void 0;
const express_1 = require("express");
const driver_validation_1 = require("./driver.validation");
const driver_controler_1 = require("./driver.controler");
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
router.get("/", (0, checkAuth_1.checkAuth)(...Object.values(user_interfaces_1.Role)), driver_controler_1.DriverControler.getAllDriver);
router.post("/create", (0, checkAuth_1.checkAuth)(...Object.values(user_interfaces_1.Role)), validateRequest(driver_validation_1.createDriverSchema), driver_controler_1.DriverControler.createDriver);
router.patch("/availability/:id", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.DRIVER), validateRequest(driver_validation_1.updateDriverSchema), driver_controler_1.DriverControler.toggleAvailability);
router.patch("/status/:driverId", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN), 
// validateRequest(updateDriverStatusZodSchema),
driver_controler_1.DriverControler.updateDriverStatus);
router.patch("/update-my-profile", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.DRIVER), validateRequest(driver_validation_1.updateMyDriverProfileZodSchema), driver_controler_1.DriverControler.updateMyDriverProfile);
router.get("/my-profile", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.DRIVER), driver_controler_1.DriverControler.getMyDriverProfile);
router.patch("/update-availability", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.DRIVER), validateRequest(driver_validation_1.updateAvailabilityZodSchema), driver_controler_1.DriverControler.updateAvailability);
router.get("/my-ride-history", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.DRIVER), driver_controler_1.DriverControler.getDriverRideHistory);
router.get("/earnings/:id", driver_controler_1.DriverControler.getEarnings);
exports.DriverRoutes = router;
