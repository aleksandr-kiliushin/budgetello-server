import { MigrationInterface, QueryRunner } from "typeorm";

export class BudgetRecordAmountFromIntToReal1666816746281 implements MigrationInterface {
    name = 'BudgetRecordAmountFromIntToReal1666816746281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "amount" TYPE REAL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ALTER COLUMN "amount" TYPE INT`);
    }

}


