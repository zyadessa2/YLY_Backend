"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_js_1 = require("../bootstrap.js");
const connectDB_js_1 = require("../DB/config/connectDB.js");
let dbReadyPromise = null;
const ensureDbConnection = async () => {
    if (!dbReadyPromise) {
        dbReadyPromise = (0, connectDB_js_1.DBConnection)();
    }
    await dbReadyPromise;
};
exports.default = async (req, res) => {
    await ensureDbConnection();
    (0, bootstrap_js_1.app)(req, res);
};
//# sourceMappingURL=index.js.map