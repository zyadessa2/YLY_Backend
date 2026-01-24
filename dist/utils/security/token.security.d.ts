import { type JwtPayload, type Secret, type SignOptions } from 'jsonwebtoken';
import { HUserDocument } from '../../DB/models/user.model.js';
import { HTokenDocument } from '../../DB/models/token.model.js';
export declare enum TokenTypeEnum {
    Access = "Access",
    Refresh = "Refresh"
}
export declare enum LogoutEnum {
    only = "only",
    all = "all"
}
export declare const generateToken: ({ payload, secret, options }: {
    payload: object;
    secret?: Secret;
    options?: SignOptions;
}) => Promise<string>;
export declare const verifyToken: ({ token, secret, }: {
    token: string;
    secret?: Secret;
}) => Promise<JwtPayload>;
export declare const createLoginCredentials: (user: HUserDocument) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const decodeToken: ({ authorization, tokenType }: {
    authorization: string;
    tokenType?: TokenTypeEnum;
}) => Promise<{
    user: HUserDocument;
    decoded: JwtPayload;
}>;
export declare const createRevokeToken: (decoded: JwtPayload) => Promise<HTokenDocument>;
//# sourceMappingURL=token.security.d.ts.map