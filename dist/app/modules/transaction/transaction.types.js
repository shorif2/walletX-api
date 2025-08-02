"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatus = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["ADD"] = "add";
    TransactionType["WITHDRAW"] = "withdraw";
    TransactionType["SEND"] = "send";
    TransactionType["CASH_IN"] = "cash-in";
    TransactionType["CASH_OUT"] = "cash-out";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var TransactionStatus;
(function (TransactionStatus) {
    TransactionStatus["PENDING"] = "pending";
    TransactionStatus["COMPLETED"] = "completed";
    TransactionStatus["REVERSED"] = "reversed";
})(TransactionStatus || (exports.TransactionStatus = TransactionStatus = {}));
