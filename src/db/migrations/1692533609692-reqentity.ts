import { MigrationInterface, QueryRunner } from "typeorm";

export class Reqentity1692533609692 implements MigrationInterface {
    name = 'Reqentity1692533609692'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "status" SET DEFAULT 'Unallocated'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "status" SET DEFAULT 'Allocated'`);
    }

}
