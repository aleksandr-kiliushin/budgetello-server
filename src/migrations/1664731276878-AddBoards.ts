import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBoards1664731276878 implements MigrationInterface {
    name = 'AddBoards1664731276878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "board_subject" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_573d3d2cd4106c33293245bb111" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "board" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "subjectId" integer, CONSTRAINT "PK_865a0f2e22c140d261b1df80eb1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_administrated_boards_board" ("userId" integer NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "PK_0a2810eee8dad0916bb17aff68e" PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_83146940d4e22ed4b9e82d9443" ON "user_administrated_boards_board" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_a1e78b2ee3d6f5b91b4878bbc8" ON "user_administrated_boards_board" ("boardId") `);
        await queryRunner.query(`CREATE TABLE "user_boards_board" ("userId" integer NOT NULL, "boardId" integer NOT NULL, CONSTRAINT "PK_878ad615f92edb780a5c45fd9d0" PRIMARY KEY ("userId", "boardId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d92c98138733350c58be167b78" ON "user_boards_board" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ec241c244980d39996b501f397" ON "user_boards_board" ("boardId") `);
        await queryRunner.query(`ALTER TABLE "finance_category" ADD "boardId" integer`);
        await queryRunner.query(`ALTER TABLE "board" ADD CONSTRAINT "FK_c3883bef3207497274cacae9ccc" FOREIGN KEY ("subjectId") REFERENCES "board_subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "finance_category" ADD CONSTRAINT "FK_269bc39bfebdea7414b389b6c65" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_administrated_boards_board" ADD CONSTRAINT "FK_83146940d4e22ed4b9e82d94435" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_administrated_boards_board" ADD CONSTRAINT "FK_a1e78b2ee3d6f5b91b4878bbc80" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_boards_board" ADD CONSTRAINT "FK_d92c98138733350c58be167b78c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_boards_board" ADD CONSTRAINT "FK_ec241c244980d39996b501f3970" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_boards_board" DROP CONSTRAINT "FK_ec241c244980d39996b501f3970"`);
        await queryRunner.query(`ALTER TABLE "user_boards_board" DROP CONSTRAINT "FK_d92c98138733350c58be167b78c"`);
        await queryRunner.query(`ALTER TABLE "user_administrated_boards_board" DROP CONSTRAINT "FK_a1e78b2ee3d6f5b91b4878bbc80"`);
        await queryRunner.query(`ALTER TABLE "user_administrated_boards_board" DROP CONSTRAINT "FK_83146940d4e22ed4b9e82d94435"`);
        await queryRunner.query(`ALTER TABLE "finance_category" DROP CONSTRAINT "FK_269bc39bfebdea7414b389b6c65"`);
        await queryRunner.query(`ALTER TABLE "board" DROP CONSTRAINT "FK_c3883bef3207497274cacae9ccc"`);
        await queryRunner.query(`ALTER TABLE "finance_category" DROP COLUMN "boardId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec241c244980d39996b501f397"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d92c98138733350c58be167b78"`);
        await queryRunner.query(`DROP TABLE "user_boards_board"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a1e78b2ee3d6f5b91b4878bbc8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_83146940d4e22ed4b9e82d9443"`);
        await queryRunner.query(`DROP TABLE "user_administrated_boards_board"`);
        await queryRunner.query(`DROP TABLE "board"`);
        await queryRunner.query(`DROP TABLE "board_subject"`);
    }

}
