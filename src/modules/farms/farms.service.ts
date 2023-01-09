import { Repository } from "typeorm";
import { Farm } from "./entities/farms.entity";
import dataSource from "orm/orm.config";
import { CreateFarmDto } from "./dto/create-farm-dto";
import { UpdateFarmDto } from "./dto/update-farm-dto";
import { Coordinates, SharedService } from "modules/shared/shared.service";
import { User } from "modules/users/entities/user.entity";
import { ListFarmDto } from "./dto/list-farm-dto";
import { ListFarmOrderOptions } from "./enums/list-farm-order-options.enum";
import { NotFoundError } from "errors/errors";

export class FarmsService {
    private readonly farmsRepository: Repository<Farm>;

    constructor() {
        this.farmsRepository = dataSource.getRepository(Farm);
    }

    public async list(user: User, query: ListFarmDto) {
    const mainQuery = this.farmsRepository.createQueryBuilder("farm");

    mainQuery
    .innerJoinAndSelect("farm.owner", "owner")
    .select(["farm.id", "farm.name", "farm.address", "farm.size", "farm.yield", "farm.coordinates", "owner.email"]);

    if(query?.order == ListFarmOrderOptions.NAME)
        mainQuery.orderBy(ListFarmOrderOptions.NAME, "ASC");

    if(query?.order == ListFarmOrderOptions.DATE)
        mainQuery.orderBy("updatedAt", "ASC");

    if(query?.outliers === true) {
        const subQuery = mainQuery.subQuery().select("avg(farm.yield)", "avgYield").from(Farm, "farm").getQuery();
        mainQuery.where(`farm.yield > (${subQuery})`);
    }

    const farms = await mainQuery.getMany()

    const mappedFarms = await Promise.all(farms.map(async (farm) => {
        const distanceMatrixResponse = await SharedService.getDistance(
            user.coordinates as unknown as Coordinates,
            farm.coordinates as unknown as Coordinates
        );
        return {
            ...farm,
            owner: farm.owner.email,
            drivingDistance: 
            distanceMatrixResponse.data ? distanceMatrixResponse.data.rows[0].elements[0].distance.value : 0, 
        };
    }));
    if(query?.order === ListFarmOrderOptions.DRIVING_DISTANCE) {
        return mappedFarms.sort((farmA, farmB) => Number(farmA.drivingDistance) - Number(farmB.drivingDistance));
    } else {
        return mappedFarms;
    }
    }

    public async create(id: string, createFarmDto: CreateFarmDto) {
        const saveData = createFarmDto;
        const geo = (await SharedService.getGeo(createFarmDto.address))?.data?.results[0]?.geometry?.location;
        if(!geo) {
            throw new NotFoundError("couldn't find address")
        } else {
            const coordinates = `(${geo.lat},${geo.lng})`;
            Object.assign(saveData, { coordinates })
        }
        
        return this.farmsRepository.save({ ...createFarmDto, owner: { id }});
    }

    public async update(id: string, ownerId: string, data: UpdateFarmDto) {
        const updateData = data;
        if(data?.address) {
            const geo = (await SharedService.getGeo(data.address)).data.results[0].geometry.location;
            if(!geo) {
                throw new NotFoundError("couldn't find address")
            } else {
                const coordinates = `(${geo.lat},${geo.lng})`;
                Object.assign(updateData, { coordinates })
            }
        }

        return this.farmsRepository.update({ id, owner: { id: ownerId }}, updateData as Farm);
    }

    public delete(id: string, ownerId: string) {
        return this.farmsRepository.delete({ id, owner: { id: ownerId } });
    }
}
