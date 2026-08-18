import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { getTransactionId } from "../../utils/getTransectionId";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLService } from "../sslCommerz/sslCommerz.service";

/**
 * Duplicate DB Collections / replica
 *
 * Relica DB -> [ Create Booking -> Create Payment ->  Update Booking -> Error] -> Real DB
 */

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transectionId = getTransactionId();

  const session = await Booking.startSession();
  session.startTransaction();

  try {
    const user = await User.findById(userId);

    console.log({ user });

    if (!user?.phone || !user?.address) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        "Need to add address and phone, update profile",
      );
    }

    const tour = await Tour.findById(payload.tour).select("costFrom");

    if (!tour?.costFrom) {
      throw new AppError(httpStatus.NOT_FOUND, "No tour cost found");
    }

    const amount = Number(tour.costFrom) * Number(payload.guestCount);

    const booking = await Booking.create(
      [
        {
          user: userId,
          status: BOOKING_STATUS.PENDING,
          ...payload,
        },
      ],
      { session },
    );

    const payment = await Payment.create(
      [
        {
          booking: booking[0]._id,
          status: PAYMENT_STATUS.UNPAID,
          transactionId: transectionId,
          amount,
        },
      ],
      { session },
    );

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking[0]._id },
      { payment: payment[0]._id },
      { new: true, runValidators: true, session },
    )
      .populate("user", "name email phone address")
      .populate("tour", "title costFrom")
      .populate("payment");

    const userAddress = (updatedBooking?.user as any).address;
    const userEmail = (updatedBooking?.user as any).email;
    const userPhoneNumber = (updatedBooking?.user as any).phone;
    const userName = (updatedBooking?.user as any).name;

    const sslPayload: ISSLCommerz = {
      address: userAddress,
      email: userEmail,
      phoneNumber: userPhoneNumber,
      name: userName,
      amount,
      transactionId: transectionId,
    };

    const sslPayment = await SSLService.sslPaymentInit(sslPayload);

    await session.commitTransaction();
    session.endSession();

    // return updatedBooking;
    return {
      paymentUrl: sslPayment.GatewayPageURL,
      booking: updatedBooking,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Complete -> Backend(localhost:5000/api/v1/payment/success) -> Update Payment(PAID) & Booking(CONFIRM) -> redirect to frontend -> Frontend(localhost:5173/payment/success)

// Frontend(localhost:5173) - User - Tour - Booking (Pending) - Payment(Unpaid) -> SSLCommerz Page -> Payment Fail / Cancel -> Backend(localhost:5000) -> Update Payment(FAIL / CANCEL) & Booking(FAIL / CANCEL) -> redirect to frontend -> Frontend(localhost:5173/payment/cancel or localhost:5173/payment/fail)

const getUserBookings = async () => {
  return {};
};
const getBookingById = async () => {
  return {};
};
const getBookingStatus = async () => {
  return {};
};
const getAllBookings = async () => {
  return {};
};

export const BookingServices = {
  createBooking,
  getUserBookings,
  getBookingById,
  getBookingStatus,
  getAllBookings,
};
