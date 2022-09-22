import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFinanceCategoriesAndGroupsRelations1663848391946 implements MigrationInterface {
    name = 'AddFinanceCategoriesAndGroupsRelations1663848391946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance_category" ADD "groupId" integer`);
        await queryRunner.query(`ALTER TABLE "finance_category" ADD CONSTRAINT "FK_545c5727a62848428cf118028b2" FOREIGN KEY ("groupId") REFERENCES "groups"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance_category" DROP CONSTRAINT "FK_545c5727a62848428cf118028b2"`);
        await queryRunner.query(`ALTER TABLE "finance_category" DROP COLUMN "groupId"`);
    }

}
