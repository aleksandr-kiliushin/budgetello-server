import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameUserParticipatedBoards1666345608131 implements MigrationInterface {
    name = 'RenameUserParticipatedBoards1666345608131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f"`);
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_be8002cea52485625c631cfd60b"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_9271d66122d95fdca086e089b89"`);
        await queryRunner.query(`CREATE TABLE "user_participated_boards_board" ("userId" integer NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "PK_1d3ce2d5a249807716d67e3488e" PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c87fccd5c88582e88684820219" ON "user_participated_boards_board" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c066999b15611098e2950e8cbe" ON "user_participated_boards_board" ("boardId") `);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_8e4d99801f523eb62b7a9e04649" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_7128e60fce45d26ecbfc18ac985" FOREIGN KEY ("typeId") REFERENCES "budget_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_0dbda261fad9c4d99b69ebb3183" FOREIGN KEY ("categoryId") REFERENCES "budget_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_participated_boards_board" ADD CONSTRAINT "FK_c87fccd5c88582e886848202191" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_participated_boards_board" ADD CONSTRAINT "FK_c066999b15611098e2950e8cbec" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_participated_boards_board" DROP CONSTRAINT "FK_c066999b15611098e2950e8cbec"`);
        await queryRunner.query(`ALTER TABLE "user_participated_boards_board" DROP CONSTRAINT "FK_c87fccd5c88582e886848202191"`);
        await queryRunner.query(`ALTER TABLE "budget_record" DROP CONSTRAINT "FK_0dbda261fad9c4d99b69ebb3183"`);
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_7128e60fce45d26ecbfc18ac985"`);
        await queryRunner.query(`ALTER TABLE "budget_category" DROP CONSTRAINT "FK_8e4d99801f523eb62b7a9e04649"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c066999b15611098e2950e8cbe"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c87fccd5c88582e88684820219"`);
        await queryRunner.query(`DROP TABLE "user_participated_boards_board"`);
        await queryRunner.query(`ALTER TABLE "budget_record" ADD CONSTRAINT "FK_9271d66122d95fdca086e089b89" FOREIGN KEY ("categoryId") REFERENCES "budget_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_be8002cea52485625c631cfd60b" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "budget_category" ADD CONSTRAINT "FK_1959ed2d3e425f4b97b455f974f" FOREIGN KEY ("typeId") REFERENCES "budget_category_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
