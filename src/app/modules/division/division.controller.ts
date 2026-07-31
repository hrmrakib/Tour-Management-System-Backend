import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { DivisionServices } from "./division.service";
import { IDivision } from "./division.interface";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const createDivision = catchAsync(async (req: Request, res: Response) => {
  const payload: IDivision = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const result = await DivisionServices.createDivision(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Division created successfully",
    data: result,
  });
});

const getAllDivisions = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;

  const result = await DivisionServices.getAllDivisions(
    query as Record<string, string>,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Divisions retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const getSingleDivision = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  const result = await DivisionServices.getSingleDivision(slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Division retrieved successfully",
    data: result,
  });
});

const updateDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const payload: Partial<IDivision> = {
    ...req.body,
    thumbnail: req.file?.path,
  };
  const result = await DivisionServices.updatedivision(id, payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Division updated successfully",
    data: result,
  });
});

const deleteDivision = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DivisionServices.deleteDivision(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Division deleted successfully",
    data: result,
  });
});

export const DivisionController = {
  createDivision,
  getAllDivisions,
  getSingleDivision,
  updateDivision,
  deleteDivision,
};
