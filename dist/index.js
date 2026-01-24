"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bootstrap_1 = require("./bootstrap");
if (process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3000;
    bootstrap_1.app.listen(port, () => {
        console.log("Server running on port", port);
    });
}
exports.default = bootstrap_1.app;
//# sourceMappingURL=index.js.map