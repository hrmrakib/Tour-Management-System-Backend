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

const getAllTours = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourServices.getAllTours(
    query as Record<string, string>,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tours retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTour = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const result = await TourServices.getSingleTour(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour retrieved successfully",
    data: result,
  });
});

const updateTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.updateTour(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour updated successfully",
    data: result,
  });
});

const deleteTour = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.deleteTour(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour deleted successfully",
    data: result,
  });
});

const createTourType = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;

  const result = await TourServices.createTourType(name);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour type created successfully",
    data: result,
  });
});

const getAllTourTypes = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await TourServices.getAllTourTypes(
    query as Record<string, string>,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour types retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.getSingleTourType(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour type retrieved successfully",
    data: result,
  });
});

const updateTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { name } = req.body;
  const result = await TourServices.updateTourType(id, name);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour type updated successfully",
    data: result,
  });
});

const deleteTourType = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await TourServices.deleteTourType(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Tour type deleted successfully",
    data: result,
  });
});

export const TourController = {
  createTour,
  getAllTours,
  getSingleTour,
  updateTour,
  deleteTour,

  createTourType,
  getAllTourTypes,
  getSingleTourType,
  updateTourType,
  deleteTourType,
};
