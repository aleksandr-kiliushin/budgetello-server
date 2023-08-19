import { MigrationInterface, QueryRunner } from "typeorm"

export class RemoveActivities1692448083963 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_record"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_category"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "activity_category_measurement_type"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Do nothing. Drop tables irreversible.
    }

}
