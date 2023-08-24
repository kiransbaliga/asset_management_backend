import { MigrationInterface, QueryRunner } from "typeorm";

export class Newbtable1692773861146 implements MigrationInterface {
    name = 'Newbtable1692773861146'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requestitem" ADD "is_done" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "requestitem" DROP COLUMN "is_done"`);
    }

}
