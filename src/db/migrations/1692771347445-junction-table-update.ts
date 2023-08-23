import { MigrationInterface, QueryRunner } from "typeorm";

export class JunctionTableUpdate1692771347445 implements MigrationInterface {
    name = 'JunctionTableUpdate1692771347445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcatogeryEmployee" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "subcategory_id" integer NOT NULL, "count" integer NOT NULL, CONSTRAINT "PK_2de277e9af6c60dde5b50776d4d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subcatogeryEmployee" ADD CONSTRAINT "FK_0e7985fd14fd902f48f31b1ed9b" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subcatogeryEmployee" ADD CONSTRAINT "FK_a17fcf96db3602933abf2bd2d99" FOREIGN KEY ("subcategory_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcatogeryEmployee" DROP CONSTRAINT "FK_a17fcf96db3602933abf2bd2d99"`);
        await queryRunner.query(`ALTER TABLE "subcatogeryEmployee" DROP CONSTRAINT "FK_0e7985fd14fd902f48f31b1ed9b"`);
        await queryRunner.query(`DROP TABLE "subcatogeryEmployee"`);
    }

}
