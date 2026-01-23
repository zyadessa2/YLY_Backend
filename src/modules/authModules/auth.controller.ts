// auth.controller.ts
import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.services";
import { successResponse } from "../../utils/response/success.response";

export class AuthController {
    private authService = new AuthService();

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.authService.login(req.body);
            
            successResponse({
                res,
                message: "Login successful",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
            
            successResponse({
                res,
                message: "Token refreshed successfully",
                data: result
            });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this.authService.logout(req.body.user._id.toString());
            
            successResponse({
                res,
                message: "Logged out successfully",
                data: null
            });
        } catch (error) {
            next(error);
        }
    };

}
