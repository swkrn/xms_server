"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_codes_1 = require("http-status-codes");
const auth_config_1 = __importDefault(require("../configs/auth.config"));
const validateUser = (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Token is empty'
            });
        }
        const verified = jsonwebtoken_1.default.verify(token, auth_config_1.default.passwordKey);
        if (!verified) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Can\'t verify identity'
            });
        }
        req.user_id = verified._id;
        req.token = token;
        return next();
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            err: err
        });
    }
};
exports.default = {
    validateUser,
};
