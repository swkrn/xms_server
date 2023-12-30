"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middlewere_1 = __importDefault(require("../middleweres/auth.middlewere"));
const router = (0, express_1.Router)();
router.post('/register', auth_controller_1.default.register);
router.post('/login', auth_controller_1.default.login);
router.get('/is-valid-token', auth_middlewere_1.default.validateUser, auth_controller_1.default.isValidToken);
exports.default = router;
