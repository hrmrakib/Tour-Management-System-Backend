import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";
import { BookingServices } from "./booking.service";
import httpStatus from "http-status-codes";
import sendResponse from "../../utils/sendResponse";

const createBooking = catchAsync(async (req: Request, res: Response) => {
  const decodedToken = req.user as JwtPayload;
  const booking = await BookingServices.createBooking(
    req.body,
    decodedToken.id,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Booking created successfully",
    data: booking,
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {});

const getSingleBooking = catchAsync(async (req: Request, res: Response) => {});

const getAllBookings = catchAsync(async (req: Request, res: Response) => {});

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response) => {},
);

export const BookingController = {
  createBooking,
  getUserBookings,
  getSingleBooking,
  getAllBookings,
  updateBookingStatus,
};
