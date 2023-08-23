import { MigrationInterface, QueryRunner } from "typeorm";

export class JunctionTableUpdated1692770158103 implements MigrationInterface {
    name = 'JunctionTableUpdated1692770158103'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcatogery" RENAME COLUMN "flag" TO "count"`);
        await queryRunner.query(`ALTER TABLE "subcatogery" ALTER COLUMN "count" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcatogery" ALTER COLUMN "count" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "subcatogery" RENAME COLUMN "count" TO "flag"`);
    }

}
