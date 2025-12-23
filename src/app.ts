import express from "express";
import type { Request, Response } from "express";

const app = express();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: "Hello World",
    data: null,
  });
});

export default app;
