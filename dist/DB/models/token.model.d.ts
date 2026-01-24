import { Types, HydratedDocument } from 'mongoose';
export interface IToken {
    jti: string;
    expiresIn: number;
    userId: Types.ObjectId;
}
export declare const TokenModel: any;
export type HTokenDocument = HydratedDocument<IToken>;
//# sourceMappingURL=token.model.d.ts.map