import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { createUserZodSchema } from "./user.validation";

const router = Router();

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await createUserZodSchema.parseAsync(req.body);
      req.body = payload;
      next();
    } catch (error) {
      next(error);
    }
  },
  userController.createUser
);

const userRouter = router;
export default userRouter;
