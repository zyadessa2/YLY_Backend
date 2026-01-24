import { ILoginResponse, IRefreshResponse } from "./auth.entities";
import { loginDTO, refreshTokenDTO } from "./auth.DTO";
export declare class AuthService {
    private userRepo;
    constructor();
    /**
     * User Login
     * Validates credentials, checks user status, and generates tokens
     */
    login: (loginData: loginDTO) => Promise<ILoginResponse>;
    /**
     * Refresh Access Token
     * Validates refresh token and generates new access token
     */
    refreshToken: (refreshTokenData: refreshTokenDTO) => Promise<IRefreshResponse>;
    /**
     * Logout
     * Removes refresh token from database
     */
    logout: (userId: string) => Promise<void>;
}
//# sourceMappingURL=auth.services.d.ts.map