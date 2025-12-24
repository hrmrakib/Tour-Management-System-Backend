import express from "express";
import type { NextFunction, Request, Response } from "express";
import cors from "cors";
import { corsOptions } from "./app/config/corsOptions";
import baseRouter from "./app/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply CORS middleware from separate config
app.use(cors(corsOptions));
// Explicitly handle preflight for all routes
app.options("*", cors(corsOptions));

app.use("/api/v1", baseRouter);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Server is running! ",
    data: null,
  });
});

// global error
app.use((error: any, res: Request, res: Response, next: NextFunction)=>{

  res.status(500).json({
    success: false,
    message: `Something has been wrong! ${err.message}`,
    error
  })
})

export default app;
