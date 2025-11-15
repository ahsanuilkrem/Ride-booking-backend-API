"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const mongoose_1 = require("mongoose");
const payment_interfaces_1 = require("./payment.interfaces");
const PaymentSchema = new mongoose_1.Schema({
    rider: { type: mongoose_1.Schema.Types.ObjectId, ref: "Ride", },
    transanctionId: { type: String, required: true, unique: true },
    status: { type: String,
        enum: Object.values(payment_interfaces_1.PAYMENT_STATUS),
        default: payment_interfaces_1.PAYMENT_STATUS.UNPAID
    },
    amount: {
        type: Number,
        // required: true,
    },
    paymentGatewayData: {
        type: mongoose_1.Schema.Types.Mixed,
    },
    invoiceUrl: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});
exports.Payment = (0, mongoose_1.model)("Payment", PaymentSchema);
