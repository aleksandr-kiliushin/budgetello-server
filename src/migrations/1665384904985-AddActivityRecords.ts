import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityRecords1665384904985 implements MigrationInterface {
    name = 'AddActivityRecords1665384904985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "activity_record" ("booleanValue" boolean, "comment" character varying NOT NULL, "date" character varying NOT NULL, "id" SERIAL NOT NULL, "quantitativeValue" real, "categoryId" integer, CONSTRAINT "PK_a7314c500ea63e9981c91dc03a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "activity_record" ADD CONSTRAINT "FK_b0b34ed787f2cab035f7372952f" FOREIGN KEY ("categoryId") REFERENCES "activity_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activity_record" DROP CONSTRAINT "FK_b0b34ed787f2cab035f7372952f"`);
        await queryRunner.query(`DROP TABLE "activity_record"`);
    }

}
