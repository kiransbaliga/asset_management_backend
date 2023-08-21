import { MigrationInterface, QueryRunner } from "typeorm";

export class StatusModified1692514423489 implements MigrationInterface {
    name = 'StatusModified1692514423489'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "status" SET DEFAULT 'Unallocated'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "status" SET DEFAULT 'Allocated'`);
    }

}
