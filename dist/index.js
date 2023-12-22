"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const db_config_1 = __importDefault(require("./configs/db.config"));
mongoose_1.default.connect(db_config_1.default.dbUrl);
app.use(express_1.default.json());
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
app.use('/auth', auth_route_1.default);
app.use('/message', message_route_1.default);
const server = http_1.default.createServer(app);
const io = new socket_io_1.default.Server(server);
const message_socket_1 = __importDefault(require("./sockets/message.socket"));
io.on('connection', socket => {
    (0, message_socket_1.default)(io, socket);
});
server.listen(port, () => {
    console.log(`[server]: Server is running on port ${port}`);
});
