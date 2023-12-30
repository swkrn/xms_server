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
const pair_model_1 = __importDefault(require("../models/pair.model"));
const http_status_codes_1 = require("http-status-codes");
const mongoose_1 = __importDefault(require("mongoose"));
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { user_id } = req;
        const { with_id } = req.body;
        if (!with_id) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'No with_id in json body'
            });
        }
        let messages = yield message_model_1.default
            .find().or([
            { from_id: user_id, to_id: with_id },
            { from_id: with_id, to: user_id }
        ])
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
        const { with_id } = req.body;
        if (!with_id) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({
                msg: 'No with_id in json body'
            });
        }
        let messages = yield message_model_1.default
            .find().or([
            { from_id: user_id, to_id: with_id },
            { from_id: with_id, to: user_id }
        ])
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
const getMessagesList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let messagesList = yield pair_model_1.default
            .find()
            .or([
            { first_id: new mongoose_1.default.Types.ObjectId(req.user_id) },
            { second_id: new mongoose_1.default.Types.ObjectId(req.user_id) }
        ])
            .populate('first_id', 'username')
            .populate('second_id', 'username')
            .sort({ last_time: -1 })
            .lean();
        let msgList = [];
        for (let each of messagesList) {
            msgList.push({
                _id: each._id,
                pair_user: (each.first_id._id.toString() !== req.user_id)
                    ? each.first_id
                    : each.second_id,
                last_message: each.last_message,
                last_time: each.last_time,
            });
        }
        return res.json(msgList);
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
    getMessagesList,
};
