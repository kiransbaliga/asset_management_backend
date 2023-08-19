import { MigrationInterface, QueryRunner } from "typeorm";

export class Reqentity1692442518899 implements MigrationInterface {
    name = 'Reqentity1692442518899'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_a698ace6b647d7ef2f7f07d39b2"`);
        await queryRunner.query(`ALTER TABLE "request" ALTER COLUMN "asset_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_a698ace6b647d7ef2f7f07d39b2" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "request" DROP CONSTRAINT "FK_a698ace6b647d7ef2f7f07d39b2"`);
        await queryRunner.query(`ALTER TABLE "request" ALTER COLUMN "asset_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "request" ADD CONSTRAINT "FK_a698ace6b647d7ef2f7f07d39b2" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
