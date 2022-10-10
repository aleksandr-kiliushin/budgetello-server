import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameBudgetingToBudget1665420923983 implements MigrationInterface {
    name = 'RenameBudgetingToBudget1665420923983'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budgeting_category_type" RENAME TO "budget_category_type"`);
        await queryRunner.query(`ALTER TABLE "budgeting_category" RENAME TO "budget_category"`);
        await queryRunner.query(`ALTER TABLE "budgeting_record" RENAME TO "budget_record"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_category_type_id_seq" RENAME TO "budget_category_type_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_category_id_seq" RENAME TO "budget_category_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budgeting_record_id_seq" RENAME TO "budget_record_id_seq"`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_category_type" RENAME TO "budgeting_category_type"`);
        await queryRunner.query(`ALTER TABLE "budget_category" RENAME TO "budgeting_category"`);
        await queryRunner.query(`ALTER TABLE "budget_record" RENAME TO "budgeting_record"`);
        await queryRunner.query(`ALTER SEQUENCE "budget_category_type_id_seq" RENAME TO "budgeting_category_type_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budget_category_id_seq" RENAME TO "budgeting_category_id_seq"`);
        await queryRunner.query(`ALTER SEQUENCE "budget_record_id_seq" RENAME TO "budgeting_record_id_seq"`);
    }

}
