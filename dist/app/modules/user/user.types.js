"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isApproved = exports.Role = void 0;
var Role;
(function (Role) {
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["AGENT"] = "AGENT";
})(Role || (exports.Role = Role = {}));
var isApproved;
(function (isApproved) {
    isApproved["ACTIVE"] = "ACTIVE";
    isApproved["INACTIVE"] = "INACTIVE";
    isApproved["BLOCKED"] = "BLOCKED";
})(isApproved || (exports.isApproved = isApproved = {}));
