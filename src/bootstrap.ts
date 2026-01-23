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
app.use(cors())
app.use(helmet())

const limiter = rateLimit({
    windowMs: 60 * 60000, // 60 minutes
    max: 2000, // limit each IP to 2000 requests per windowMs 
    message: 'Too many requests from this IP, please try again after 60 minutes',
    statusCode: 429,
})
app.use(limiter)

// Routes - MUST come after middleware
app.use('/api/v1', router)

// Connect to DB
DBConnection().catch(err => console.error('DB Connection Error:', err));

// global error handler
app.use(globalErrorHandler)

// invalid route handler
app.use("*" , (req:Request , res:Response )=>{
    return res.status(404).json({message: "Route not found"});
})

// For local development - start server
const bootstrap = ():void =>{
    const port = process.env.PORT || 3000 ;
    app.listen(port , ()=>{
        console.log("server is running in port" , port);
    })
}

// Export app for Vercel
export { app };
export default bootstrap;