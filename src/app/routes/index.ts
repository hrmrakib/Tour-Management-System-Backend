import { Router } from "express";
import UserRouter from "../modules/user/user.route";
import AuthRouter from "../modules/auth/auth.route";
import { TourRouter } from "../modules/tour/tour.route";
import { DivisionRouter } from "../modules/division/division.route";
import { BookingRouter } from "../modules/booking/booking.route";

const baseRouter = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/user",
    route: UserRouter,
  },
  {
    path: "/division",
    route: DivisionRouter,
  },
  {
    path: "/tour",
    route: TourRouter,
  },
  {
    path: "/booking",
    route: BookingRouter,
  },
];

moduleRoutes.forEach((module) => {
  baseRouter.use(module.path, module.route);
});

export default baseRouter;
