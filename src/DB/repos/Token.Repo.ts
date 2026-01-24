import { DBRepo } from './DBRepo.js';
import { IToken as TDocument } from '../models/token.model.js';
import { Model } from 'mongoose';  

export class TokenRepo extends DBRepo<TDocument>{
    constructor(protected override readonly model:Model<TDocument, {}, {}, {}, TDocument, any, any>){
        super(model)
    }
}