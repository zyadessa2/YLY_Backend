"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_services_js_1 = require("./auth.services.js");
const success_response_js_1 = require("../../utils/response/success.response.js");
class AuthController {
    constructor() {
        this.authService = new auth_services_js_1.AuthService();
        this.login = async (req, res, next) => {
            try {
                const result = await this.authService.login(req.body);
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Login successful",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.refreshToken = async (req, res, next) => {
            try {
                const authHeader = req.headers.authorization || '';
                // التحقق من وجود Bearer
                if (!authHeader.startsWith('Bearer ')) {
                    throw new Error('Authorization header must start with "Bearer"');
                }
                // استخراج التوكن وحذف "Bearer "
                const token = authHeader.slice(7); // "Bearer " = 7 characters
                if (!token) {
                    throw new Error('Token is required after Bearer prefix');
                }
                const result = await this.authService.refreshToken({ authorization: token });
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Token refreshed successfully",
                    data: result
                });
            }
            catch (error) {
                next(error);
            }
        };
        this.logout = async (req, res, next) => {
            try {
                await this.authService.logout(req.body.user._id.toString());
                (0, success_response_js_1.successResponse)({
                    res,
                    message: "Logged out successfully",
                    data: null
                });
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map