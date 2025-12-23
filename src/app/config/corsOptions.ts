import { CorsOptions } from "cors";

// Configure allowed origins via env (comma separated), fallback to localhost
const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export const corsOptions: CorsOptions = {
  // dynamic origin function so we can allow an allowlist and still return true for non-browser tools (no origin)
  origin: (origin, callback) => {
    // allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    callback(new Error("CORS: Origin not allowed"));
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  exposedHeaders: ["Authorization"],
  credentials: true, // enable cookies/auth to be sent
  optionsSuccessStatus: 204, 
  maxAge: 86400, 
};
