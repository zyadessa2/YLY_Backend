import express from 'express';
import type {Request , Response , NextFunction} from 'express';

import router from './modules/routes';
import { globalErrorHandler, IError } from './utils/response/error.response';
import { DBConnection } from './DB/config/connectDB';

import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import {config} from "dotenv";

// Load .env only in development (Vercel uses environment variables directly)
if (process.env.NODE_ENV !== 'production') {
    config();
}

const app = express();


// Middleware setup - MUST come before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet())

const limter = rateLimit({
    windowMs: 60 * 60000, // 15 minutes
    max: 2000, // limit each IP to 100 requests per windowMs 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    statusCode: 429,
})
app.use(limter)

// Routes - MUST come after middleware
app.use('/api/v1', router)
DBConnection().catch(console.error)

app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
app.use(globalErrorHandler)



export { app };