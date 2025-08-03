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
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controler_1 = require("./user.controler");
const user_validation_1 = require("./user.validation");
const user_interfaces_1 = require("./user.interfaces");
const checkAuth_1 = require("../../../middiewares/checkAuth");
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
router.post("/register", validateRequest(user_validation_1.creatUserZodSchema), user_controler_1.UserControllers.createUser);
router.get("/all-users", (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN), user_controler_1.UserControllers.getAllUsers);
router.patch("/:id", validateRequest(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(...Object.values(user_interfaces_1.Role)), user_controler_1.UserControllers.updateUser);
router.patch('/block/:id', validateRequest(user_validation_1.updateUserZodSchema), (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN), user_controler_1.UserControllers.Userblock);
router.patch('/unblock/:id', (0, checkAuth_1.checkAuth)(user_interfaces_1.Role.ADMIN), validateRequest(user_validation_1.updateUserZodSchema), user_controler_1.UserControllers.UserUnblock);
exports.UserRoutes = router;
