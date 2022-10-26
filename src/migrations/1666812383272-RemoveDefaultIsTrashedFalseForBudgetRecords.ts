import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDefaultIsTrashedFalseForBudgetRecords1666812383272 implements MigrationInterface {
    name = 'RemoveDefaultIsTrashedFalseForBudgetRecords1666812383272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "isTrashed" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "isTrashed" SET DEFAULT false`);
    }

}
