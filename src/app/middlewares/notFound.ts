import { Request, Response } from "express";
import HSC from "http-status-codes";

const notFound = (req: Request, res: Response) => {
  res.status(HSC.NOT_FOUND).json({
    success: false,
    statusCode: 404,
    message: "Route not found! ",
  });
};

export default notFound;
