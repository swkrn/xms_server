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
const message_model_1 = __importDefault(require("../models/message.model"));
const http_status_codes_1 = require("http-status-codes");
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req;
        let messages = yield message_model_1.default
            .find().or([{ from_id: user_id }, { to_id: user_id }])
            .sort({ time: 1 })
            .lean();
        return res.json(messages);
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            err: err
        });
    }
});
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req;
        const { page } = req.params;
        const limit = 5;
        const skip = (parseInt(page) - 1) * limit;
        let messages = yield message_model_1.default
            .find().or([{ from_id: user_id }, { to_id: user_id }])
            .sort({ time: -1 })
            .skip(skip)
            .limit(limit)
            .lean();
        return res.json(messages);
    }
    catch (err) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({
            err: err
        });
    }
});
exports.default = {
    getAllMessages,
    getMessages,
};
