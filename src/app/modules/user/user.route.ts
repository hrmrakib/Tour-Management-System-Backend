import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

router.post("/register", validateRequest(createUserZodSchema), userController.createUser);

const userRouter = router;
export default userRouter;
