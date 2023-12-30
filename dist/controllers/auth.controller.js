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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const auth_config_1 = __importDefault(require("../configs/auth.config"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (username.length < 3 || username.length > 20) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Username length must between 3-20 characters'
            });
        }
        if (password.length < 8 || password > 20) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Password length must between 8-20 characters'
            });
        }
        const existingUser = yield user_model_1.default.findOne({ username });
        if (existingUser) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: `Username '${username}' is already takken`
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, auth_config_1.default.saltLength);
        let user = new user_model_1.default({
            username,
            hashedPassword,
        });
        user = yield user.save();
        return res.json({
            msg: `Successfully created account '${user.username}'`
        });
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            err: err
        });
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield user_model_1.default.findOne({ username });
        if (!user) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Username not found'
            });
        }
        const isPasswordMatch = yield bcryptjs_1.default.compare(password, user.hashedPassword);
        if (!isPasswordMatch) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'Incorrect password'
            });
        }
        const token = jsonwebtoken_1.default.sign({ _id: user._id }, auth_config_1.default.passwordKey);
        return res.json({ token, username: user.username });
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            err: err
        });
    }
});
const isValidToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json(true);
});
exports.default = {
    register,
    login,
    isValidToken,
};
