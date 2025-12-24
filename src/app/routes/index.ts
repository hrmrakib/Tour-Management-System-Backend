import { Router } from "express";
import userRouter from "../modules/user/user.route";


const baseRouter = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter
    }
]

moduleRoutes.forEach((module)=> {
    baseRouter.use(module.path, module.route)
})

export default baseRouter