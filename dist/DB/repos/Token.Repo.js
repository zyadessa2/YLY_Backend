"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenRepo = void 0;
const DBRepo_js_1 = require("./DBRepo.js");
class TokenRepo extends DBRepo_js_1.DBRepo {
    constructor(model) {
        super(model);
        this.model = model;
    }
}
exports.TokenRepo = TokenRepo;
//# sourceMappingURL=Token.Repo.js.map