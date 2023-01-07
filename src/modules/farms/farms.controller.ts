import { NotFoundError } from "errors/errors";
import { NextFunction, Response } from "express";
import { CustomRequest } from "middlewares/auth.middleware";
import { UsersService } from "modules/users/users.service";
import { CreateFarmDto } from "./dto/create-farm-dto";
import { ListFarmDto } from "./dto/list-farm-dto";
import { FarmsService } from "./farms.service";

export class FarmsController {
    private readonly farmsService: FarmsService;
    private readonly usersService: UsersService;

    constructor() {
        this.farmsService = new FarmsService();
        this.usersService = new UsersService();
    }

    public async list(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const user = await this.usersService.findOneBy({ id: req.token.id });
            if(!user) throw new NotFoundError("User no found");
            const farms = await this.farmsService.list(user, req.query as unknown as ListFarmDto); // req.query as ListFarmDto
            res.status(200).send(farms);
        } catch (error) {
            next(error);
        }
    }

    public async create(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { id } = req.token;
            const farms = await this.farmsService.create(id, req.body as CreateFarmDto);
            res.status(201).send(farms);
        } catch (error) {
            next(error);
        }
    }

    public async update(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { id: ownerId } = req.token;
            const { id } = req.params;
            await this.farmsService.update(id, ownerId, req.body as CreateFarmDto);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    public async delete(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { id: ownerId } = req.token;
            const { id } = req.params;
            const farms = await this.farmsService.delete(id, ownerId);
            res.status(200).send(farms);
        } catch (error) {
            next(error);
        }
    }
}
