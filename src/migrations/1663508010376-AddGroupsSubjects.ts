import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupsSubjects1663508010376 implements MigrationInterface {
    name = 'AddGroupsSubjects1663508010376'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups_subjects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_fd76f0c0c8a802ed5b0b22edd36" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "groups_subjects"`);
    }

}
