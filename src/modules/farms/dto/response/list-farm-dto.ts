export class FarmResponseDto {
    public name: string;
  
    public address: string;

    public owner: string;

    public size: string;

    public yield: number;

    public drivingDistance: string;
}

export class ListFarmResponseDto {
    public farms: FarmResponseDto[]
}
