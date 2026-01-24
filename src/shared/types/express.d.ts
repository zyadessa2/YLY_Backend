import { IUser } from '../DB/models/user.model.js';
import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            user?: IUser;
            decoded?: JwtPayload;
            resource?: any; // For checkOwnership middleware
        }
    }
}
