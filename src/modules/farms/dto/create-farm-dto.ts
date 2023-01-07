import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString, IsString } from "class-validator";

export class CreateFarmDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsString()
  @IsNotEmpty()
  public address: string;

  @IsNumberString()
  @IsNotEmpty()
  public size: string;

  @IsNumberString()
  @Transform(({ value} ) => Number(value))
  public yield: number;
}
