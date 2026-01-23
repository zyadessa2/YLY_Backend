import { v4 as uuid } from 'uuid'
import { sign, verify } from "jsonwebtoken"
import type { JwtPayload, Secret, SignOptions } from "jsonwebtoken"
import { HUserDocument, UserModel } from "../../DB/models/user.model";
import { BadRequestException, UnAuthorizedException } from "../response/error.response";
import { UserRepo } from "../../DB/repos/User.Repo";
import { TokenRepo } from '../../DB/repos/Token.Repo';
import { HTokenDocument, TokenModel } from '../../DB/models/token.model';

export enum TokenTypeEnum {
    Access = "Access",
    Refresh = "Refresh",
}

export enum LogoutEnum {
    only = "only",
    all = "all"
}

export const generateToken = async ({
    payload,
    secret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
    options = { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) }
}: {
    payload: object,
    secret?: Secret,
    options?: SignOptions
}): Promise<string> => {
    return sign(payload, secret, options);
}

export const verifyToken = async ({
    token,
    secret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string,
}: {
    token: string,
    secret?: Secret,
}): Promise<JwtPayload> => {
    return verify(token, secret) as JwtPayload;
}

// we create login credentials (access token and refresh token) for user
export const createLoginCredentials = async (user: HUserDocument) => {
    const accessTokenSecret = process.env.ACCESS_USER_TOKEN_SIGNATURE as string;
    const refreshTokenSecret = process.env.REFRESH_USER_TOKEN_SIGNATURE as string;

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



export const decodeToken = async ({
    authorization,
    tokenType = TokenTypeEnum.Access
}: {
    authorization: string,
    tokenType?: TokenTypeEnum
}): Promise<{ user: HUserDocument, decoded: JwtPayload }> => {

    const usermodel = new UserRepo(UserModel);
    const tokenModel = new TokenRepo(TokenModel);
    
    const [bearerKey, token] = authorization.split(" ");
    if (!bearerKey || !token) {
        throw new UnAuthorizedException("missing authorization token");
    }
    
    // Select correct secret based on token type
    const secret = tokenType === TokenTypeEnum.Refresh 
        ? (process.env.REFRESH_USER_TOKEN_SIGNATURE as string)
        : (process.env.ACCESS_USER_TOKEN_SIGNATURE as string);

    const decoded = await verifyToken({ token, secret });

    if (!decoded.userId || !decoded.iat) {
        throw new BadRequestException("invalid token payload");
    }
    
    if (await tokenModel.findOne({ filter: { jti: decoded.jti } })) {
        throw new UnAuthorizedException("invalid or old login credentials")
    }

    const user = await usermodel.findOne({ filter: { _id: decoded.userId } });
    if (!user) {
        throw new BadRequestException("not registered user");
    }

    if ((user.changeCredentialsTime?.getTime() || 0) > decoded.iat * 1000) {
        throw new UnAuthorizedException("invalid or old login credentials")
    }

    return { user, decoded }
};

export const createRevokeToken = async (decoded: JwtPayload) : Promise<HTokenDocument> => {
    const tokenModel = new TokenRepo(TokenModel);

    const results = await tokenModel.create([{
        jti: decoded.jti as string,
        expiresIn: (decoded.iat as number) +
            Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
        userId: decoded.userId,
    }]);
    
    const result = Array.isArray(results) ? results[0] : results;

    if(!result){
        throw new BadRequestException("fail to revoke token")
    }
    return result
}