import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAddressAndCoordinates1672908652789 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" point`);
    
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
    }

}
