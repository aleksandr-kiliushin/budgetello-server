import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorToBudgetRecord1676519512421 implements MigrationInterface {
    name = 'AddAuthorToBudgetRecord1676519512421'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" ADD "authorId" integer`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_3728a5cfeacf72c498d8d953f4b" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_3728a5cfeacf72c498d8d953f4b"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP COLUMN "authorId"`);
    }

}
