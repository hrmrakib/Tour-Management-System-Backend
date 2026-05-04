import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import { TourServices } from "./tour.service";

const createTour = catchAsync(async (req: Request, res: Response) => {
  const result = await TourServices.createTour(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour created successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
};
