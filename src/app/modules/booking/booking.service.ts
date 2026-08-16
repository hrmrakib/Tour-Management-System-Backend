import { BOOKING_STATUS, IBooking } from "./booking.interface";
import { getTransactionId } from "../../utils/getTransectionId";
import { Booking } from "./booking.model";
import { User } from "../user/user.model";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Tour } from "../tour/tour.model";
import { Payment } from "../payment/payment.model";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";

const createBooking = async (payload: Partial<IBooking>, userId: string) => {
  const transectionId = getTransactionId();

  const session = await Booking.startSession();

  session.startTransaction();

  try {
    const user = await User.findById(userId);

    if (!user?.phone || !user?.address) {
      throw new AppError(httpStatus.NOT_FOUND, "Need to add address and phone");
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

    const payment = await Payment.create([
      {
        booking: booking[0]._id,
        status: BOOKING_STATUS.PENDING,
        transactionId: transectionId,
        amount,
      },
    ]);

    const updatedBooking = await Booking.findOneAndUpdate(
      booking[0]._id,
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

    // const sslPayment = await SSLService()
  } catch (error) {}
};

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
