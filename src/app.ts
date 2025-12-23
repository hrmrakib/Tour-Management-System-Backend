import express from "express";
import type { Request, Response } from "express";
import userRouter from "./app/modules/user/user.route";
import cors from "cors";
import { corsOptions } from "./app/config/corsOptions";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS middleware from separate config
app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options("*", cors(corsOptions));

app.use("/api/v1/user", userRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running! ",
    data: null,
  });
});

export default app;
