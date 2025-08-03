"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsBlocked = exports.IsActive = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["RIDER"] = "RIDER";
    Role["DRIVER"] = "DRIVER";
})(Role || (exports.Role = Role = {}));
var IsActive;
(function (IsActive) {
    IsActive["ACTIVE"] = "ACTIVE";
    IsActive["INACTIVE"] = "INACTIVE";
})(IsActive || (exports.IsActive = IsActive = {}));
var IsBlocked;
(function (IsBlocked) {
    IsBlocked["BLOCKED"] = "BLOCKED";
    IsBlocked["UNBLOCKED"] = "UNBLOCKED";
})(IsBlocked || (exports.IsBlocked = IsBlocked = {}));
