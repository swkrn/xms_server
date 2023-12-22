"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbConfig = {
    dbUrl: process.env.DBURL || 'mongodb://localhost:27017/xms'
};
exports.default = dbConfig;
