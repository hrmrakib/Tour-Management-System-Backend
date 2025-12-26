import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import checkAuth from "../../middlewares/checkAuth";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);

router.get(
  "/all-users",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  userController.getAllUsers
);

const userRouter = router;
export default userRouter;
