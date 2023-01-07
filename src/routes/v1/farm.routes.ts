import { RequestHandler, Router } from "express";
import { authenticateToken } from "middlewares/auth.middleware";
import dtoValidationMiddleware from "middlewares/validation.middleware";
import { CreateFarmDto } from "modules/farms/dto/create-farm-dto";
import { ListFarmDto } from "modules/farms/dto/list-farm-dto";
import { UpdateFarmDto } from "modules/farms/dto/update-farm-dto";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

router.get("/", authenticateToken, dtoValidationMiddleware(ListFarmDto, "query"), farmsController.list.bind(farmsController) as RequestHandler);
router.post("/", authenticateToken, dtoValidationMiddleware(CreateFarmDto, "body"), farmsController.create.bind(farmsController) as RequestHandler);
router.patch("/:id", authenticateToken, dtoValidationMiddleware(UpdateFarmDto, "body"), farmsController.update.bind(farmsController) as RequestHandler);
router.delete("/:id", authenticateToken, farmsController.delete.bind(farmsController) as RequestHandler);

export default router;
