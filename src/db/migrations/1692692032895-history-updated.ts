import { MigrationInterface, QueryRunner } from "typeorm";

export class HistoryUpdated1692692032895 implements MigrationInterface {
    name = 'HistoryUpdated1692692032895'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "end_date"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ADD "end_date" integer`);
        await queryRunner.query(`ALTER TABLE "history" ADD "start_date" integer NOT NULL`);
    }

}
