import { MigrationInterface, QueryRunner } from "typeorm";

export class AddActivityCategories1665312466709 implements MigrationInterface {
    name = 'AddActivityCategories1665312466709'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_269bc39bfebdea7414b389b6c65"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_974b4481b02a5abab70d29c01bd"`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" DROP CONSTRAINT "FK_f013431c4ebbfccbb8976107236"`);
        await queryRunner.query(`CREATE TABLE "activity_category_measurement_type" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_19a4d03bf42a9e6dc2bb38c98f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "activity_category" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "unit" character varying, "boardId" integer, "measurementTypeId" integer, "ownerId" integer, CONSTRAINT "PK_5d3d888450207667a286922f945" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_be8002cea52485625c631cfd60b" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f" FOREIGN KEY ("typeId") REFERENCES "budgeting_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_category" ADD CONSTRAINT "FK_34c40d0500144c9b761d554c241" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_category" ADD CONSTRAINT "FK_fdcab41a9c3affc0b8294403647" FOREIGN KEY ("measurementTypeId") REFERENCES "activity_category_measurement_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "activity_category" ADD CONSTRAINT "FK_1ecf910593dfe28c66b046c52db" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" ADD CONSTRAINT "FK_9271d66122d95fdca086e089b89" FOREIGN KEY ("categoryId") REFERENCES "budgeting_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgeting_record" DROP CONSTRAINT "FK_9271d66122d95fdca086e089b89"`);
        await queryRunner.query(`ALTER TABLE "activity_category" DROP CONSTRAINT "FK_1ecf910593dfe28c66b046c52db"`);
        await queryRunner.query(`ALTER TABLE "activity_category" DROP CONSTRAINT "FK_fdcab41a9c3affc0b8294403647"`);
        await queryRunner.query(`ALTER TABLE "activity_category" DROP CONSTRAINT "FK_34c40d0500144c9b761d554c241"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" DROP CONSTRAINT "FK_be8002cea52485625c631cfd60b"`);
        await queryRunner.query(`DROP TABLE "activity_category"`);
        await queryRunner.query(`DROP TABLE "activity_category_measurement_type"`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" ADD CONSTRAINT "FK_f013431c4ebbfccbb8976107236" FOREIGN KEY ("categoryId") REFERENCES "budgeting_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_974b4481b02a5abab70d29c01bd" FOREIGN KEY ("typeId") REFERENCES "budgeting_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" ADD CONSTRAINT "FK_269bc39bfebdea7414b389b6c65" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
