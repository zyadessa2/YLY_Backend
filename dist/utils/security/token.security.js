import { v4 as uuid } from 'uuid';
import { sign, verify } from 'jsonwebtoken';
import { UserModel } from '../../DB/models/user.model.js';
import { BadRequestException, UnAuthorizedException } from '../response/error.response.js';
import { UserRepo } from '../../DB/repos/User.Repo.js';
import { TokenRepo } from '../../DB/repos/Token.Repo.js';
import { TokenModel } from '../../DB/models/token.model.js';
export var TokenTypeEnum;
(function (TokenTypeEnum) {
    TokenTypeEnum["Access"] = "Access";
    TokenTypeEnum["Refresh"] = "Refresh";
})(TokenTypeEnum || (TokenTypeEnum = {}));
export var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["only"] = "only";
    LogoutEnum["all"] = "all";
})(LogoutEnum || (LogoutEnum = {}));
export const generateToken = async ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) } }) => {
    return sign(payload, secret, options);
};
export const verifyToken = async ({ token, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, }) => {
    return verify(token, secret);
};
export const createLoginCredentials = async (user) => {
    const accessTokenSecret = process.env.ACCESS_USER_TOKEN_SIGNATURE;
    const refreshTokenSecret = process.env.REFRESH_USER_TOKEN_SIGNATURE;
    const jwtid = uuid();
    const accessToken = await generateToken({
        payload: { userId: user._id.toString() },
        secret: accessTokenSecret,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN), jwtid }
    });
    const refreshToken = await generateToken({
        payload: { userId: user._id.toString() },
        secret: refreshTokenSecret,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), jwtid }
    });
    return { accessToken, refreshToken };
};
export const decodeToken = async ({ authorization, tokenType = TokenTypeEnum.Access }) => {
    const usermodel = new UserRepo(UserModel);
    const tokenModel = new TokenRepo(TokenModel);
    const [bearerKey, token] = authorization.split(" ");
    if (!bearerKey || !token) {
        throw new UnAuthorizedException("missing authorization token");
    }
    const secret = tokenType === TokenTypeEnum.Refresh
        ? process.env.REFRESH_USER_TOKEN_SIGNATURE
        : process.env.ACCESS_USER_TOKEN_SIGNATURE;
    const decoded = await verifyToken({ token, secret });
    if (!decoded.userId || !decoded.iat) {
        throw new BadRequestException("invalid token payload");
    }
    if (await tokenModel.findOne({ filter: { jti: decoded.jti } })) {
        throw new UnAuthorizedException("invalid or old login credentials");
    }
    const user = await usermodel.findOne({ filter: { _id: decoded.userId } });
    if (!user) {
        throw new BadRequestException("not registered user");
    }
    if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
        throw new UnAuthorizedException("invalid or old login credentials");
    }
    return { user, decoded };
};
export const createRevokeToken = async (decoded) => {
    const tokenModel = new TokenRepo(TokenModel);
    const results = await tokenModel.create([{
            jti: decoded.jti,
            expiresIn: decoded.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            userId: decoded.userId,
        }]);
    const result = Array.isArray(results) ? results[0] : results;
    if (!result) {
        throw new BadRequestException("fail to revoke token");
    }
    return result;
};
//# sourceMappingURL=token.security.js.map