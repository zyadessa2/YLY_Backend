import bootstrap from "./bootstrap";

// For local development - start server
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}

// For Vercel serverless - export the app
export default bootstrap();