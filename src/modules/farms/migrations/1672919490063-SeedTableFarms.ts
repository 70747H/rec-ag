import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedTableFarms1672919490063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        insert into public.farm (id, name, address, coordinates, size, yield, "createdAt", "updatedAt", "ownerId")
            values ('58633a23-a4c7-4fda-b3b9-d7f18a658186', 'Randers', 'Randers', '(56.460449,10.036367)', '21.5', 8.50,
                    '2023-01-05 14:17:53.131238', '2023-01-05 14:17:53.131238', 'f9b2536d-d46e-436d-83bd-190ae90bbabb'),
                ('d43109ed-4d2b-405e-8c26-60e372a41cdd', 'Copenhagen', 'Copenhagen', '(55.676098,12.568337)', '24.5', 1.50,
                    '2023-01-05 14:17:53.131238', '2023-01-05 14:17:53.131238', '33aab596-e642-444b-bebf-22c033a5c047'),
                ('cca40088-aeed-4108-acce-52ba395c2a66', 'Herning', 'Herning', '(56.140934,8.968116)', '25.2', 50.50,
                    '2023-01-05 14:17:53.131238', '2023-01-05 14:17:53.131238', 'a0b5909d-45b1-413d-bac2-c1564395b7c8'),
                ('0c0c313b-f2a0-4d54-b507-411f5d0aa55d', 'Aalborg', 'Aalborg', '(57.046707,9.935932)', '21.3', 8.50,
                    '2023-01-05 14:17:53.131238', '2023-01-05 14:17:53.131238', '00858080-0c7a-44ce-9107-2f21c68b8b32')
        `);
    }
 
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM TABLE farm WHERE id IN(
                58633a23-a4c7-4fda-b3b9-d7f18a658186,
                d43109ed-4d2b-405e-8c26-60e372a41cdd,
                cca40088-aeed-4108-acce-52ba395c2a66,
                0c0c313b-f2a0-4d54-b507-411f5d0aa55d)
        `);
    }

}
