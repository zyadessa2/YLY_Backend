"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// modules/routes.js
const express_1 = require("express");
const auth_routes_js_1 = __importDefault(require("./authModules/auth.routes.js"));
const user_routes_js_1 = __importDefault(require("./userModule/user.routes.js"));
const news_routes_js_1 = __importDefault(require("./newsModule/news.routes.js"));
const event_routes_js_1 = __importDefault(require("./eventModules/event.routes.js"));
const governorate_routes_js_1 = __importDefault(require("./governorateModule/governorate.routes.js"));
const router = (0, express_1.Router)();
router.use('/auth', auth_routes_js_1.default);
router.use('/users', user_routes_js_1.default);
router.use('/news', news_routes_js_1.default);
router.use('/events', event_routes_js_1.default);
router.use('/governorates', governorate_routes_js_1.default);
router.all('{/*s}', (req, res) => {
    res.status(404).json({ message: "API route not found" });
});
exports.default = router;
//# sourceMappingURL=routes.js.map