import { JwtPayload } from 'jsonwebtoken';
import { HUserDocument } from '../../DB/models/user.model.js';
declare module "express-serve-static-core" {
    interface Request {
        user?: HUserDocument;
        decoded?: JwtPayload;
    }
}
//# sourceMappingURL=request.express.d.ts.map