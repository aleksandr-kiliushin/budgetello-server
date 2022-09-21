import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOnGroupsAndUsersDelete1663732728601 implements MigrationInterface {
    name = 'CascadeOnGroupsAndUsersDelete1663732728601'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups_groups" DROP CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5"`);
        await queryRunner.query(`ALTER TABLE "user_groups_groups" ADD CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_groups_groups" DROP CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5"`);
        await queryRunner.query(`ALTER TABLE "user_groups_groups" ADD CONSTRAINT "FK_ff63fc1f7fc395e0fa08dc9cdf5" FOREIGN KEY ("groupsId") REFERENCES "groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
