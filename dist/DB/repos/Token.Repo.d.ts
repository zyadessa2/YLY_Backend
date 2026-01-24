import { DBRepo } from './DBRepo.js';
import { IToken as TDocument } from '../models/token.model.js';
import { Model } from 'mongoose';
export declare class TokenRepo extends DBRepo<TDocument> {
    protected readonly model: Model<TDocument, {}, {}, {}, TDocument, any, any>;
    constructor(model: Model<TDocument, {}, {}, {}, TDocument, any, any>);
}
//# sourceMappingURL=Token.Repo.d.ts.map