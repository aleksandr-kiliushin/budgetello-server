import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameFinancesToBudgeting1664909097677 implements MigrationInterface {
    name = 'RenameFinancesToBudgeting1664909097677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "finance_category_type" RENAME TO "budgeting_category_type"`);
        await queryRunner.query(`ALTER TABLE "finance_category" RENAME TO "budgeting_category"`);
        await queryRunner.query(`ALTER TABLE "finance_record" RENAME TO "budgeting_record"`);
        await queryRunner.query(`ALTER SEQUENCE "finance_category_type_id_seq" RENAME TO "budgeting_category_type_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "finance_category_id_seq" RENAME TO "budgeting_category_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "finance_record_id_seq" RENAME TO "budgeting_record_id_seq"`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgeting_category_type" RENAME TO "finance_category_type"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" RENAME TO "finance_category"`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" RENAME TO "finance_record"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_category_type_id_seq" RENAME TO "finance_category_type_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_category_id_seq" RENAME TO "finance_category_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_record_id_seq" RENAME TO "finance_category_id_seq"`);
    }

}
