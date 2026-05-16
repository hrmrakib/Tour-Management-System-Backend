import { Router } from "express";
import { TourController } from "./tour.controller";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validateRequest";
import { createTourTypeZodSchema } from "./tour.validation";

const router = Router();

router.post(
  "/create-tour-type",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.createTourType,
);

router.get("/all-tour-types", TourController.getAllTourTypes);

router.get("/single-tour-type/:id", TourController.getSingleTourType);

router.patch(
  "/update-tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.updateTourType,
);

router.delete(
  "/delete-tour-type/:id",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.deleteTourType,
);

router.post(
  "/create-tour",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.createTour,
);

router.get("/all-tours", TourController.getAllTours);

router.get("/single-tour/:slug", TourController.getSingleTour);

router.patch(
  "/update-tour/:slug",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createTourTypeZodSchema),
  TourController.updateTour,
);

router.delete(
  "/delete-tour/:slug",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  TourController.deleteTour,
);

export const TourRouter = router;
