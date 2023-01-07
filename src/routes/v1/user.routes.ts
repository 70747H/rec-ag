import { RequestHandler, Router } from "express";
import dtoValidationMiddleware from "middlewares/validation.middleware";
import { CreateUserDto } from "modules/users/dto/create-user.dto";
import { UsersController } from "modules/users/users.controller";

const router = Router();
const usersController = new UsersController();

router.post("/", dtoValidationMiddleware(CreateUserDto, "body"), usersController.create.bind(usersController) as RequestHandler);

export default router;
