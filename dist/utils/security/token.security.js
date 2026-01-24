"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRevokeToken = exports.decodeToken = exports.createLoginCredentials = exports.verifyToken = exports.generateToken = exports.LogoutEnum = exports.TokenTypeEnum = void 0;
const uuid_1 = require("uuid");
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_js_1 = require("../../DB/models/user.model.js");
const error_response_js_1 = require("../response/error.response.js");
const User_Repo_js_1 = require("../../DB/repos/User.Repo.js");
const Token_Repo_js_1 = require("../../DB/repos/Token.Repo.js");
const token_model_js_1 = require("../../DB/models/token.model.js");
var TokenTypeEnum;
(function (TokenTypeEnum) {
    TokenTypeEnum["Access"] = "Access";
    TokenTypeEnum["Refresh"] = "Refresh";
})(TokenTypeEnum || (exports.TokenTypeEnum = TokenTypeEnum = {}));
var LogoutEnum;
(function (LogoutEnum) {
    LogoutEnum["only"] = "only";
    LogoutEnum["all"] = "all";
})(LogoutEnum || (exports.LogoutEnum = LogoutEnum = {}));
const generateToken = async ({ payload, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) } }) => {
    return (0, jsonwebtoken_1.sign)(payload, secret, options);
};
exports.generateToken = generateToken;
const verifyToken = async ({ token, secret = process.env.ACCESS_USER_TOKEN_SIGNATURE, }) => {
    return (0, jsonwebtoken_1.verify)(token, secret);
};
exports.verifyToken = verifyToken;
const createLoginCredentials = async (user) => {
    const accessTokenSecret = process.env.ACCESS_USER_TOKEN_SIGNATURE;
    const refreshTokenSecret = process.env.REFRESH_USER_TOKEN_SIGNATURE;
    const jwtid = (0, uuid_1.v4)();
    const accessToken = await (0, exports.generateToken)({
        payload: { userId: user._id.toString() },
        secret: accessTokenSecret,
        options: { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN), jwtid }
    });
    const refreshToken = await (0, exports.generateToken)({
        payload: { userId: user._id.toString() },
        secret: refreshTokenSecret,
        options: { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN), jwtid }
    });
    return { accessToken, refreshToken };
};
exports.createLoginCredentials = createLoginCredentials;
const decodeToken = async ({ authorization, tokenType = TokenTypeEnum.Access }) => {
    const usermodel = new User_Repo_js_1.UserRepo(user_model_js_1.UserModel);
    const tokenModel = new Token_Repo_js_1.TokenRepo(token_model_js_1.TokenModel);
    const [bearerKey, token] = authorization.split(" ");
    if (!bearerKey || !token) {
        throw new error_response_js_1.UnAuthorizedException("missing authorization token");
    }
    const secret = tokenType === TokenTypeEnum.Refresh
        ? process.env.REFRESH_USER_TOKEN_SIGNATURE
        : process.env.ACCESS_USER_TOKEN_SIGNATURE;
    const decoded = await (0, exports.verifyToken)({ token, secret });
    if (!decoded.userId || !decoded.iat) {
        throw new error_response_js_1.BadRequestException("invalid token payload");
    }
    if (await tokenModel.findOne({ filter: { jti: decoded.jti } })) {
        throw new error_response_js_1.UnAuthorizedException("invalid or old login credentials");
    }
    const user = await usermodel.findOne({ filter: { _id: decoded.userId } });
    if (!user) {
        throw new error_response_js_1.BadRequestException("not registered user");
    }
    if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
        throw new error_response_js_1.UnAuthorizedException("invalid or old login credentials");
    }
    return { user, decoded };
};
exports.decodeToken = decodeToken;
const createRevokeToken = async (decoded) => {
    const tokenModel = new Token_Repo_js_1.TokenRepo(token_model_js_1.TokenModel);
    const results = await tokenModel.create([{
            jti: decoded.jti,
            expiresIn: decoded.iat + Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
            userId: decoded.userId,
        }]);
    const result = Array.isArray(results) ? results[0] : results;
    if (!result) {
        throw new error_response_js_1.BadRequestException("fail to revoke token");
    }
    return result;
};
exports.createRevokeToken = createRevokeToken;
//# sourceMappingURL=token.security.js.map