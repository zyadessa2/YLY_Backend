import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from '../../DB/models/user.model.js';

// extend express request type to include user and decoded properties
declare module "express-serve-static-core" {
    interface Request {
        user? : HUserDocument,
        decoded? : JwtPayload
    }
}