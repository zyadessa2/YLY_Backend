"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = require("dotenv");
const routes_js_1 = __importDefault(require("./modules/routes.js"));
const connectDB_js_1 = require("./DB/config/connectDB.js");
const error_response_js_1 = require("./utils/response/error.response.js");
if (process.env.NODE_ENV !== "production") {
    (0, dotenv_1.config)();
}
const app = (0, express_1.default)();
exports.app = app;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60000,
    max: 2000,
    message: "Too many requests from this IP, please try again after 60 minutes",
    statusCode: 429
});
app.use(limiter);
// Routes
app.use("/api/v1", routes_js_1.default);
// DB connection
(0, connectDB_js_1.DBConnection)().catch(console.error);
// Invalid route handler 
app.all('*', (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use(error_response_js_1.globalErrorHandler);
//# sourceMappingURL=bootstrap.js.map