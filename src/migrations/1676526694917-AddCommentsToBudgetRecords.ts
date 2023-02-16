import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCommentsToBudgetRecords1676526694917 implements MigrationInterface {
    name = 'AddCommentsToBudgetRecords1676526694917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ADD "comment" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP COLUMN "comment"`);
    }

}
