"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const user_model_js_1 = require("../../DB/models/user.model.js");
const governorate_model_js_1 = require("../../DB/models/governorate.model.js");
const error_response_js_1 = require("../../utils/response/error.response.js");
const User_Repo_js_1 = require("../../DB/repos/User.Repo.js");
const hash_security_js_1 = require("../../utils/security/hash.security.js");
const token_security_js_1 = require("../../utils/security/token.security.js");
class AuthService {
    constructor() {
        this.userRepo = new User_Repo_js_1.UserRepo(user_model_js_1.UserModel);
        /**
         * User Login
         * Validates credentials, checks user status, and generates tokens
         */
        this.login = async (loginData) => {
            const { email, password } = loginData;
            // Find user with password field (since it's select: false)
            const user = await this.userRepo.findOne({
                filter: { email },
                select: '+password +refreshToken',
                populate: [{ path: 'governorateId', model: governorate_model_js_1.GovernorateModel, select: 'name arabicName slug logo coverImage' }]
            });
            if (!user) {
                throw new error_response_js_1.NotFoundException("Invalid email or password");
            }
            // Check if user is soft deleted
            if (user.deletedAt) {
                throw new error_response_js_1.ForbidenException("Your account has been deleted");
            }
            // Check if user is active
            if (!user.isActive) {
                throw new error_response_js_1.ForbidenException("Your account has been deactivated. Please contact support.");
            }
            // Verify password
            const isPasswordValid = await (0, hash_security_js_1.compareHash)(password, user.password);
            if (!isPasswordValid) {
                throw new error_response_js_1.NotFoundException("Invalid email or password");
            }
            // Generate access and refresh tokens
            const credentials = await (0, token_security_js_1.createLoginCredentials)(user);
            // Save refresh token to database
            await this.userRepo.updateOne({
                filter: { _id: user._id },
                data: { refreshToken: credentials.refreshToken }
            });
            // Remove sensitive data before returning
            const userResponse = user.toObject();
            const { password: _, refreshToken: __, ...safeUser } = userResponse;
            return {
                credentials,
                user: {
                    _id: safeUser._id.toString(),
                    email: safeUser.email,
                    role: safeUser.role,
                    governorateId: safeUser.governorateId ? {
                        _id: safeUser.governorateId._id.toString(),
                        name: safeUser.governorateId.name,
                        arabicName: safeUser.governorateId.arabicName,
                        slug: safeUser.governorateId.slug,
                        logo: safeUser.governorateId.logo,
                        coverImage: safeUser.governorateId.coverImage
                    } : undefined,
                    isActive: safeUser.isActive,
                    createdAt: safeUser.createdAt,
                    updatedAt: safeUser.updatedAt
                }
            };
        };
        /**
         * Refresh Access Token
         * Validates refresh token and generates new access token
         */
        this.refreshToken = async (refreshTokenData) => {
            const { refreshToken } = refreshTokenData;
            // Verify refresh token using the correct secret for refresh tokens
            let decoded;
            try {
                const refreshTokenSecret = process.env.REFRESH_USER_TOKEN_SIGNATURE;
                decoded = await (0, token_security_js_1.verifyToken)({
                    token: refreshToken,
                    secret: refreshTokenSecret
                });
            }
            catch (error) {
                throw new error_response_js_1.UnAuthorizedException("Invalid or expired refresh token");
            }
            // Find user with refresh token
            const user = await this.userRepo.findOne({
                filter: { _id: decoded.userId },
                select: '+refreshToken'
            });
            if (!user) {
                throw new error_response_js_1.NotFoundException("User not found");
            }
            // Check if refresh token matches
            if (user.refreshToken !== refreshToken) {
                throw new error_response_js_1.UnAuthorizedException("Invalid refresh token");
            }
            // Check if user is active and not deleted
            if (!user.isActive || user.deletedAt) {
                throw new error_response_js_1.ForbidenException("User account is not active");
            }
            // Generate new access token
            const newAccessToken = await (0, token_security_js_1.generateToken)({
                payload: {
                    userId: user._id.toString(),
                    email: user.email,
                    role: user.role,
                    governorateId: user.governorateId?.toString()
                },
                secret: token_security_js_1.TokenTypeEnum.Access
            });
            return {
                accessToken: newAccessToken
            };
        };
        /**
         * Logout
         * Removes refresh token from database
         */
        this.logout = async (userId) => {
            await this.userRepo.updateOne({
                filter: { _id: userId },
                data: { refreshToken: null }
            });
        };
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.services.js.map