import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupsAndUsersRelationship1663608005153 implements MigrationInterface {
    name = 'AddGroupsAndUsersRelationship1663608005153'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_groups_groups" ("userId" integer NOT NULL, "groupsId" integer NOT NULL, CONSTRAINT "PK_1cc66107284483728254dad1652" PRIMARY KEY ("userId", "groupsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6088ae6c82b482df6ce989d543" ON "user_groups_groups" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ff63fc1f7fc395e0fa08dc9cdf" ON "user_groups_groups" ("groupsId") `);
        await queryRunner.query(`ALTER TABLE "user_groups_groups" ADD CONSTRAINT "FK_6088ae6c82b482df6ce989d5431" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_groups_groups" ADD CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups_groups" DROP CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5"`);
        await queryRunner.query(`ALTER TABLE "user_groups_groups" DROP CONSTRAINT "FK_6088ae6c82b482df6ce989d5431"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ff63fc1f7fc395e0fa08dc9cdf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6088ae6c82b482df6ce989d543"`);
        await queryRunner.query(`DROP TABLE "user_groups_groups"`);
    }

}
