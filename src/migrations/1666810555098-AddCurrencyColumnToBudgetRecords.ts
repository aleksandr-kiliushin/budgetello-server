import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencyColumnToBudgetRecords1666810555098 implements MigrationInterface {
    name = 'AddCurrencyColumnToBudgetRecords1666810555098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ADD "currencySlug" character varying`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_992c609ec3faaf18a47f46969ce" FOREIGN KEY ("currencySlug") REFERENCES "currency"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_992c609ec3faaf18a47f46969ce"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP COLUMN "currencySlug"`);
    }

}
