import type { Response, Request } from "express";
import { UserModel } from "../../DB/models/user.model";
import { GovernorateModel } from "../../DB/models/governorate.model";
import { 
    NotFoundException,
    UnAuthorizedException,
    ForbidenException 
} from "../../utils/response/error.response";
import { UserRepo } from "../../DB/repos/User.Repo";
import { compareHash } from "../../utils/security/hash.security";
import { 
    createLoginCredentials, 
    generateToken, 
    TokenTypeEnum,
    verifyToken
} from "../../utils/security/token.security";
import { ILoginResponse, IRefreshResponse } from "./auth.entities";
import { loginDTO, refreshTokenDTO } from "./auth.DTO";

export class AuthService {
    private userRepo = new UserRepo(UserModel);

    constructor() {}

    /**
     * User Login
     * Validates credentials, checks user status, and generates tokens
     */
    login = async (loginData: loginDTO): Promise<ILoginResponse> => {
        const { email, password } = loginData;

        // Find user with password field (since it's select: false)
        const user = await this.userRepo.findOne({
            filter: { email },
            select: '+password +refreshToken',
            populate: [{ path: 'governorateId', model: GovernorateModel, select: 'name arabicName slug logo coverImage' }]
        });

        if (!user) {
            throw new NotFoundException("Invalid email or password");
        }

        // Check if user is soft deleted
        if (user.deletedAt) {
            throw new ForbidenException("Your account has been deleted");
        }

        // Check if user is active
        if (!user.isActive) {
            throw new ForbidenException("Your account has been deactivated. Please contact support.");
        }

        // Verify password
        const isPasswordValid = await compareHash(password, user.password);
        if (!isPasswordValid) {
            throw new NotFoundException("Invalid email or password");
        }

        // Generate access and refresh tokens
        const credentials = await createLoginCredentials(user);

        // Save refresh token to database
        await this.userRepo.updateOne({
            filter: { _id: user._id },
            data: { refreshToken: credentials.refreshToken }
        });

        // Remove sensitive data before returning
        const userResponse = user.toObject() as any;
        const { password: _, refreshToken: __, ...safeUser } = userResponse;

        return {
            credentials,
            user: {
                _id: safeUser._id.toString(),
                email: safeUser.email,
                role: safeUser.role,
                governorateId: safeUser.governorateId ? {
                    _id: (safeUser.governorateId as any)._id.toString(),
                    name: (safeUser.governorateId as any).name,
                    arabicName: (safeUser.governorateId as any).arabicName,
                    slug: (safeUser.governorateId as any).slug,
                    logo: (safeUser.governorateId as any).logo,
                    coverImage: (safeUser.governorateId as any).coverImage
                } : undefined as any,
                isActive: safeUser.isActive,
                createdAt: safeUser.createdAt,
                updatedAt: safeUser.updatedAt!
            }
        };
    };

    /**
     * Refresh Access Token
     * Validates refresh token and generates new access token
     */
    refreshToken = async (refreshTokenData: refreshTokenDTO): Promise<IRefreshResponse> => {
        const { refreshToken } = refreshTokenData as { refreshToken: string };

        // Verify refresh token using the correct secret for refresh tokens
        let decoded;
        try {
            const refreshTokenSecret = process.env.REFRESH_USER_TOKEN_SIGNATURE as string;
            decoded = await verifyToken({ 
                token: refreshToken, 
                secret: refreshTokenSecret
            });
        } catch (error) {
            throw new UnAuthorizedException("Invalid or expired refresh token");
        }

        // Find user with refresh token
        const user = await this.userRepo.findOne({
            filter: { _id: decoded.userId },
            select: '+refreshToken'
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }

        // Check if refresh token matches
        if (user.refreshToken !== refreshToken) {
            throw new UnAuthorizedException("Invalid refresh token");
        }

        // Check if user is active and not deleted
        if (!user.isActive || user.deletedAt) {
            throw new ForbidenException("User account is not active");
        }

        // Generate new access token
        const newAccessToken = await generateToken({
            payload: {
                userId: user._id.toString(),
                email: user.email,
                role: user.role,
                governorateId: user.governorateId?.toString()
            },
            secret: TokenTypeEnum.Access
        });

        return {
            accessToken: newAccessToken
        };
    };

    /**
     * Logout
     * Removes refresh token from database
     */
    logout = async (userId: string): Promise<void> => {
        await this.userRepo.updateOne({
            filter: { _id: userId },
            data: { refreshToken: null }
        });
    };

}
