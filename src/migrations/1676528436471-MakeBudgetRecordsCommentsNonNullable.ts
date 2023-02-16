import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeBudgetRecordsCommentsNonNullable1676528436471 implements MigrationInterface {
    name = 'MakeBudgetRecordsCommentsNonNullable1676528436471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ADD "comment" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP COLUMN "comment"`);
    }

}
