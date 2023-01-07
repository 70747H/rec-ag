import { MigrationInterface, QueryRunner } from "typeorm"

export class SeedTableUsers1672919474692 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("");
        await queryRunner.query(`
        insert into public.user (id, email, "hashedPassword", "createdAt", "updatedAt", address, coordinates)
        values ('f9b2536d-d46e-436d-83bd-190ae90bbabb', 'organic@denmark.export',
                '$2b$10$l2vTf.KpXHs2GpWuea0OP.CkV1Pg/V3AE.Yg9Ch.HZ6tWjdSekGc6', '2023-01-05 12:23:22.474569',
                '2023-01-05 12:23:22.474569', 'Organic Denmark Export', '(55.684201,12.565764)'),
            ('00858080-0c7a-44ce-9107-2f21c68b8b32', 'danish@farmers.abroad',
                '$2b$10$l2vTf.KpXHs2GpWuea0OP.CkV1Pg/V3AE.Yg9Ch.HZ6tWjdSekGc6', '2023-01-05 12:23:22.474569',
                '2023-01-05 12:23:22.474569', 'Danish Farmers Abroad', '(56.01498,10.911654)'),
            ('a0b5909d-45b1-413d-bac2-c1564395b7c8', 'kunt@furbo.com',
                '$2b$10$l2vTf.KpXHs2GpWuea0OP.CkV1Pg/V3AE.Yg9Ch.HZ6tWjdSekGc6', '2023-01-05 12:16:43.858850',
                '2023-01-05 12:16:43.858850', 'Kunt Furbo', '(56.01498,10.911654)'),
            ('33aab596-e642-444b-bebf-22c033a5c047', 'peder@kristian.nielsen',
                '$2b$10$l2vTf.KpXHs2GpWuea0OP.CkV1Pg/V3AE.Yg9Ch.HZ6tWjdSekGc6', '2023-01-05 12:23:22.474569',
                '2023-01-05 12:23:22.474569', 'Peder Kristian Nielsen', '(57.273216,9.946065)');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query("");
        await queryRunner.query(`DELETE FROM TABLE user WHERE id IN(
            f9b2536d-d46e-436d-83bd-190ae90bbabb,
            00858080-0c7a-44ce-9107-2f21c68b8b32,
            a0b5909d-45b1-413d-bac2-c1564395b7c8,
            33aab596-e642-444b-bebf-22c033a5c047)`
            );
    }

}
