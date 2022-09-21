import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminsFieldToGroup1663792411165 implements MigrationInterface {
    name = 'AddAdminsFieldToGroup1663792411165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_administrated_groups_groups" ("userId" integer NOT NULL, "groupsId" integer NOT NULL, CONSTRAINT "PK_5327f5657490bca5b9dc0dfe468" PRIMARY KEY ("userId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_de73753880cc23cce8a2727caa" ON "user_administrated_groups_groups" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_640b15bb39a77ba34a8fb1ae62" ON "user_administrated_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "user_administrated_groups_groups" ADD CONSTRAINT "FK_de73753880cc23cce8a2727caa8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_administrated_groups_groups" ADD CONSTRAINT "FK_640b15bb39a77ba34a8fb1ae62c" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_administrated_groups_groups" DROP CONSTRAINT "FK_640b15bb39a77ba34a8fb1ae62c"`);
        await queryRunner.query(`ALTER TABLE "user_administrated_groups_groups" DROP CONSTRAINT "FK_de73753880cc23cce8a2727caa8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_640b15bb39a77ba34a8fb1ae62"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_de73753880cc23cce8a2727caa"`);
        await queryRunner.query(`DROP TABLE "user_administrated_groups_groups"`);
    }

}
