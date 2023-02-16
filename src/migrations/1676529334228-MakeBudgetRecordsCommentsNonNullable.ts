import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeBudgetRecordsCommentsNonNullable1676529334228 implements MigrationInterface {
    name = 'MakeBudgetRecordsCommentsNonNullable1676529334228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "comment" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "comment" DROP NOT NULL`);
    }

}
