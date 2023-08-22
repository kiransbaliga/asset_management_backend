import { MigrationInterface, QueryRunner } from "typeorm";

export class HistoryUpdate1692694383495 implements MigrationInterface {
    name = 'HistoryUpdate1692694383495'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ADD "flag" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "flag"`);
    }

}
