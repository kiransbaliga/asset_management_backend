import { MigrationInterface, QueryRunner } from "typeorm";

export class SubcategoryUpdated1692698810616 implements MigrationInterface {
    name = 'SubcategoryUpdated1692698810616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "start_date"`);
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "end_date"`);
        await queryRunner.query(`ALTER TABLE "subcategories" ADD "count" integer`);
        await queryRunner.query(`ALTER TABLE "subcategories" ADD "perishable" boolean`);
        await queryRunner.query(`ALTER TABLE "history" ADD "flag" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP COLUMN "flag"`);
        await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "perishable"`);
        await queryRunner.query(`ALTER TABLE "subcategories" DROP COLUMN "count"`);
        await queryRunner.query(`ALTER TABLE "history" ADD "end_date" character varying`);
        await queryRunner.query(`ALTER TABLE "history" ADD "start_date" character varying NOT NULL`);
    }

}
