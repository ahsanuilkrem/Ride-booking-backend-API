"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interfaces_1 = require("./user.interfaces");
const authProviderSchema = new mongoose_1.Schema({
    provider: { type: String, required: true },
    providerId: { type: String, required: true }
}, {
    versionKey: false,
    _id: false
});
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: Object.values(user_interfaces_1.Role),
        default: user_interfaces_1.Role.RIDER
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
        type: String,
        enum: Object.values(user_interfaces_1.IsActive),
        default: user_interfaces_1.IsActive.ACTIVE,
    },
    isBlocked: {
        type: String,
        enum: Object.values(user_interfaces_1.IsBlocked),
        default: user_interfaces_1.IsBlocked.UNBLOCKED
    },
    isVerified: { type: Boolean, default: false },
    auths: [authProviderSchema]
}, {
    timestamps: true,
    versionKey: false
});
exports.User = (0, mongoose_1.model)("User", userSchema);
