import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IBudgetingCategoryType } from "#interfaces/budgeting"

@Entity("activity_category_measurement_type")
export class ActivityCategoryMeasurementTypeEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetingCategoryType["id"]

  @Column({ type: "varchar" })
  name: IBudgetingCategoryType["name"]
}
