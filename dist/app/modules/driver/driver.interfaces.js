"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsStatus = exports.availaStatus = void 0;
var availaStatus;
(function (availaStatus) {
    availaStatus["ONLINE"] = "online";
    availaStatus["OFFLINE"] = "offline";
})(availaStatus || (exports.availaStatus = availaStatus = {}));
var IsStatus;
(function (IsStatus) {
    IsStatus["PENDING"] = "PENDING";
    IsStatus["APPROVED"] = "APPROVED";
    IsStatus["SUSPENDED"] = "SUSPENDED";
})(IsStatus || (exports.IsStatus = IsStatus = {}));
