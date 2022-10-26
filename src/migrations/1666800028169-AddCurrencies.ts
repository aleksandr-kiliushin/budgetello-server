import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCurrencies1666800028169 implements MigrationInterface {
    name = 'AddCurrencies1666800028169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "currency" ("name" character varying NOT NULL, "slug" character varying NOT NULL, "symbol" character varying NOT NULL, CONSTRAINT "PK_de5490c49dfa40e4c07b26c46b6" PRIMARY KEY ("slug"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "currency"`);
    }

}
