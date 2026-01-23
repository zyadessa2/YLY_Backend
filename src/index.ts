
import bootstrap from "./bootstrap";

// For local development
if (process.env.NODE_ENV !== 'production') {
    bootstrap();
}

// For Vercel serverless
export default bootstrap();