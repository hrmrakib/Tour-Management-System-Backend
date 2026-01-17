import express from "express";
import type { Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "./app/config/corsOptions";
import baseRouter from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";

const app = express();

app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS middleware from separate config
app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
// app.options("*", cors(corsOptions));

app.use("/api/v1", baseRouter);

app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running! ",
    data: null,
  });
});

// global error
app.use(globalErrorHandler);

// Not found
app.use(notFound);

export default app;
