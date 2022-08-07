import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1659879262593 implements MigrationInterface {
    name = 'Init1659879262593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "finance_category_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c3573df92b97320c973702810cc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "finance_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "typeId" integer, CONSTRAINT "PK_512af380143c8ff1fb30f04b5c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "finance_record" ("amount" integer NOT NULL, "date" character varying NOT NULL, "id" SERIAL NOT NULL, "isTrashed" boolean NOT NULL DEFAULT false, "categoryId" integer, CONSTRAINT "PK_b1e9b3884f829a2607896588590" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "finance_category" ADD CONSTRAINT "FK_974b4481b02a5abab70d29c01bd" FOREIGN KEY ("typeId") REFERENCES "finance_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance_record" ADD CONSTRAINT "FK_f013431c4ebbfccbb8976107236" FOREIGN KEY ("categoryId") REFERENCES "finance_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance_record" DROP CONSTRAINT "FK_f013431c4ebbfccbb8976107236"`);
        await queryRunner.query(`ALTER TABLE "finance_category" DROP CONSTRAINT "FK_974b4481b02a5abab70d29c01bd"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "finance_record"`);
        await queryRunner.query(`DROP TABLE "finance_category"`);
        await queryRunner.query(`DROP TABLE "finance_category_type"`);
    }

}
