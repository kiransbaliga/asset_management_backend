import { MigrationInterface, QueryRunner } from "typeorm";

export class EmployeeIdModfied1692435919403 implements MigrationInterface {
    name = 'EmployeeIdModfied1692435919403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_e273ab6b2ab53545c29d9af6555"`);
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "employee_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_e273ab6b2ab53545c29d9af6555" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_e273ab6b2ab53545c29d9af6555"`);
        await queryRunner.query(`ALTER TABLE "assets" ALTER COLUMN "employee_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_e273ab6b2ab53545c29d9af6555" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
