import { Router } from "express";
import { UserController } from "./user.controller";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";
import checkAuth from "../../middlewares/checkAuth";
import { Role } from "./user.interface";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

router.get(
  "/all-users",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  UserController.getAllUsers
);

const UserRouter = router;
export default UserRouter;
