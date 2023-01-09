import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class UpdateFarmDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public name?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public address?: string;

  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  public size?: string;

  @IsNumberString()
  @Transform(({ value} ) => Number(value))
  @IsOptional()
  public yield?: number;
}
