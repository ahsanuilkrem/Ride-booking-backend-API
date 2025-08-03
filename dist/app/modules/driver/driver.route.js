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
router.post("/create", validateRequest(driver_validation_1.createDriverSchema), driver_controler_1.DriverControler.createDriver);
router.patch("/availability/:id", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN, user_interfaces_1.Role.DRIVER), validateRequest(driver_validation_1.updateDriverSchema), driver_controler_1.DriverControler.updateStatus);
router.get("/", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN), driver_controler_1.DriverControler.getAllDriver);
router.get("/earnings/:id", driver_controler_1.DriverControler.getEarnings);
exports.DriverRoutes = router;
