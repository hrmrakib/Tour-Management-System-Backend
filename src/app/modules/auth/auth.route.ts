import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/login", authController.credentialsLogin);
router.post("/refresh-token", authController.getNewAccessToken);

const authRouter = router;
export default authRouter;
