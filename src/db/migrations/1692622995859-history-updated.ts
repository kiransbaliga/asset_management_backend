import { MigrationInterface, QueryRunner } from "typeorm";

export class HistoryUpdated1692622995859 implements MigrationInterface {
    name = 'HistoryUpdated1692622995859'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "end_date" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" ALTER COLUMN "end_date" SET NOT NULL`);
    }

}
