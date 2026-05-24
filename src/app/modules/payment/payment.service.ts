import AppError from "../../errorHelpers/AppError";
import { Payment } from "./payment.model";
import httpStatus from "http-status-codes";
// import { Booking } from "../booking/booking.model";

const initPayment = async (bookingId: string) => {
  const payment = await Payment.findOne({ booking: bookingId });

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
  }

  //   const booking = await Booking.findById(payment.booking);
};
