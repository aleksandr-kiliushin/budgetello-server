import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencies1666811439604 implements MigrationInterface {
    name = 'AddCurrencies1666811439604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("name" character varying NOT NULL, "slug" character varying NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "PK_de5490c49dfa40e4c07b26c46b6" PRIMARY KEY ("slug"))`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD "currencySlug" character varying`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_992c609ec3faaf18a47f46969ce" FOREIGN KEY ("currencySlug") REFERENCES "currency"("slug") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_992c609ec3faaf18a47f46969ce"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP COLUMN "currencySlug"`);
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
