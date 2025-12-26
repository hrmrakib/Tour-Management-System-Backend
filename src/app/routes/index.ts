import { Router } from "express";
import userRouter from "../modules/user/user.route";
import authRouter from "../modules/auth/auth.route";

const baseRouter = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
];

moduleRoutes.forEach((module) => {
  baseRouter.use(module.path, module.route);
});

export default baseRouter;
