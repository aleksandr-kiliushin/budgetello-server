import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDefaultCurrencyToBoard1674153239550 implements MigrationInterface {
    name = 'AddDefaultCurrencyToBoard1674153239550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" ADD "defaultCurrencySlug" character varying`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_fc2698adddfbc21682115e46bc4" FOREIGN KEY ("defaultCurrencySlug") REFERENCES "currency"("slug") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_fc2698adddfbc21682115e46bc4"`);
        await queryRunner.query(`ALTER TABLE "board" DROP COLUMN "defaultCurrencySlug"`);
    }

}
