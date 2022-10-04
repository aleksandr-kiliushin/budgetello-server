import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFinancesToBudgeting1664909097677 implements MigrationInterface {
    name = 'RenameFinancesToBudgeting1664909097677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "budgeting_category_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_ad1e4deffffc614ae53256b29ac" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "budgeting_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "boardId" integer, "typeId" integer, CONSTRAINT "PK_78aeb13af957e81aef2d98a5b95" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "budgeting_record" ("amount" integer NOT NULL, "date" character varying NOT NULL, "id" SERIAL NOT NULL, "isTrashed" boolean NOT NULL DEFAULT false, "categoryId" integer, CONSTRAINT "PK_f60cc76153d93e67c410aac3a92" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_be8002cea52485625c631cfd60b" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f" FOREIGN KEY ("typeId") REFERENCES "budgeting_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" ADD CONSTRAINT "FK_9271d66122d95fdca086e089b89" FOREIGN KEY ("categoryId") REFERENCES "budgeting_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgeting_record" DROP CONSTRAINT "FK_9271d66122d95fdca086e089b89"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_be8002cea52485625c631cfd60b"`);
        await queryRunner.query(`DROP TABLE "budgeting_record"`);
        await queryRunner.query(`DROP TABLE "budgeting_category"`);
        await queryRunner.query(`DROP TABLE "budgeting_category_type"`);
    }

}
