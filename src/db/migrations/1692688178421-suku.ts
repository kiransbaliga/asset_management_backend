import { MigrationInterface, QueryRunner } from "typeorm";

export class Suku1692688178421 implements MigrationInterface {
    name = 'Suku1692688178421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "history" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "asset_id" integer NOT NULL, "start_date" integer NOT NULL, "end_date" integer, CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_b4ad0d9c0471ceedd0f4e09e948" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "history" ADD CONSTRAINT "FK_a71a37a2ed5e5769bc3209fdfbd" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_a71a37a2ed5e5769bc3209fdfbd"`);
        await queryRunner.query(`ALTER TABLE "history" DROP CONSTRAINT "FK_b4ad0d9c0471ceedd0f4e09e948"`);
        await queryRunner.query(`DROP TABLE "history"`);
    }

}
