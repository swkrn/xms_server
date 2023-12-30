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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_config_1 = __importDefault(require("../configs/auth.config"));
const message_model_1 = __importDefault(require("../models/message.model"));
const pair_model_1 = __importDefault(require("../models/pair.model"));
exports.default = (io, socket) => {
    socket.on('send-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { from_token, to_id, message } = JSON.parse(data);
            console.log(data);
            const verfied = jsonwebtoken_1.default.verify(from_token, auth_config_1.default.passwordKey);
            if (!verfied) {
                return;
            }
            const from_id = verfied._id;
            // Users Pair
            let pair = yield pair_model_1.default
                .findOne()
                .or([
                { first_id: new mongoose_1.default.Types.ObjectId(from_id), second_id: new mongoose_1.default.Types.ObjectId(to_id) },
                { first_id: new mongoose_1.default.Types.ObjectId(to_id), second_id: new mongoose_1.default.Types.ObjectId(from_id) },
            ]);
            if (!pair) {
                pair = new pair_model_1.default({
                    first_id: from_id,
                    second_id: to_id,
                    last_message: message,
                    last_time: new Date()
                });
            }
            else {
                pair.last_message = message;
                pair.last_time = new Date();
            }
            yield pair.save();
            // New Message
            let msg = new message_model_1.default({
                from_id,
                to_id,
                message,
            });
            msg = yield msg.save();
            io.to(to_id).emit('recieve-message', {
                from_id,
                to_id,
                message,
            });
        }
        catch (err) {
            console.log(err);
        }
    }));
    socket.on('read-message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { reader_token, message_id } = JSON.parse(data);
            const verfied = jsonwebtoken_1.default.verify(reader_token, auth_config_1.default.passwordKey);
            if (!verfied) {
                return;
            }
            let msg = yield message_model_1.default.findById(message_id);
            if (!msg) {
                return;
            }
            if (msg.to_id.toString() != verfied._id) {
                return;
            }
            msg.isRead = true;
            msg = yield msg.save();
        }
        catch (err) {
            console.log(err);
        }
    }));
};
