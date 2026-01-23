import { DBRepo } from "./DBRepo";
import { IToken as TDocument } from "../models/token.model";
import { Model } from "mongoose";  

export class TokenRepo extends DBRepo<TDocument>{
    constructor(protected override readonly model:Model<TDocument, {}, {}, {}, TDocument, any, any>){
        super(model)
    }
}