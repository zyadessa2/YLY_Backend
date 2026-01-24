import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { config } from "dotenv";
import router from "./modules/routes";
import { DBConnection } from "./DB/config/connectDB";
import { globalErrorHandler } from "./utils/response/error.response";
if (process.env.NODE_ENV !== "production") {
    config();
}
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
const limiter = rateLimit({
    windowMs: 60 * 60000,
    max: 2000,
    message: "Too many requests from this IP, please try again after 60 minutes",
    statusCode: 429
});
app.use(limiter);
// Routes
app.use("/api/v1", router);
// DB connection
DBConnection().catch(console.error);
// Invalid route handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});
// Global error handler
app.use(globalErrorHandler);
export { app };
//# sourceMappingURL=bootstrap.js.map