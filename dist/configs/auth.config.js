"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authConfig = {
    passwordKey: process.env.PASSWORDKEY || 'password-key',
    saltLength: 12
};
exports.default = authConfig;
