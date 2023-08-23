import { MigrationInterface, QueryRunner } from "typeorm";

export class JunctionTable1692707359298 implements MigrationInterface {
    name = 'JunctionTable1692707359298'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "subcatogery" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "employee_id" integer NOT NULL, "subcategory_id" integer NOT NULL, "flag" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_f8414b7a97e9ee33c943886d51c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "subcatogery" ADD CONSTRAINT "FK_0016ebc516eb4abad730ee6419f" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "subcatogery" ADD CONSTRAINT "FK_4111c8654b4bd137bb789651822" FOREIGN KEY ("subcategory_id") REFERENCES "assets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subcatogery" DROP CONSTRAINT "FK_4111c8654b4bd137bb789651822"`);
        await queryRunner.query(`ALTER TABLE "subcatogery" DROP CONSTRAINT "FK_0016ebc516eb4abad730ee6419f"`);
        await queryRunner.query(`DROP TABLE "subcatogery"`);
    }

}
