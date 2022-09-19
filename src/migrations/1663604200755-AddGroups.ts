import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroups1663604200755 implements MigrationInterface {
    name = 'AddGroups1663604200755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "subjectId" integer, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "groups" ADD CONSTRAINT "FK_21922a6c63a78a972d5ce5daaff" FOREIGN KEY ("subjectId") REFERENCES "groups_subjects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" DROP CONSTRAINT "FK_21922a6c63a78a972d5ce5daaff"`);
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
