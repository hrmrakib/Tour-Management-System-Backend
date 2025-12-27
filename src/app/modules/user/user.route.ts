import { Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  userController.updateUser
);

router.get(
  "/all-users",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getAllUsers
);

const userRouter = router;
export default userRouter;
