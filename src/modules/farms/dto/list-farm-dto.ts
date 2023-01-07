import { Transform } from "class-transformer";
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ListFarmOrderOptions } from "../enums/list-farm-order-options.enum";

export class ListFarmDto {
    @IsString()
    @IsNotEmpty()
    @IsIn(Object.values(ListFarmOrderOptions))
    @IsOptional()
    public order: string;

    @IsBoolean()
    @Transform(({ value} ) => value === "true")
    @IsOptional()
    public outliers: boolean
}
