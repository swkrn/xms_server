"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middlewere_1 = __importDefault(require("../middleweres/auth.middlewere"));
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const router = (0, express_1.Router)();
router.get('/all-messages', auth_middlewere_1.default.validateUser, message_controller_1.default.getAllMessages);
router.get('/message/:page', auth_middlewere_1.default.validateUser, message_controller_1.default.getMessages);
exports.default = router;
