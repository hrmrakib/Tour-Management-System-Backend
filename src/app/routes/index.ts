import { Router } from "express";
import UserRouter from "../modules/user/user.route";
import AuthRouter from "../modules/auth/auth.route";

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
];

moduleRoutes.forEach((module) => {
  baseRouter.use(module.path, module.route);
});

export default baseRouter;
