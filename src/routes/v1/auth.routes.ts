import { RequestHandler, Router } from "express";
import dtoValidationMiddleware from "middlewares/validation.middleware";
import { AuthController } from "modules/auth/auth.controller";
import { LoginUserDto } from "modules/auth/dto/login-user.dto";

const router = Router();
const authController = new AuthController();

router.post("/login", dtoValidationMiddleware(LoginUserDto, "body"), authController.login.bind(authController) as RequestHandler);

export default router;
