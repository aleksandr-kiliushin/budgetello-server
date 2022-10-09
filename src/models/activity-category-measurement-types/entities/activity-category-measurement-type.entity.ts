import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IActivityCategoryMeasurementType } from "#interfaces/activities"

@Entity("activity_category_measurement_type")
export class ActivityCategoryMeasurementTypeEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IActivityCategoryMeasurementType["id"]

  @Column({ type: "varchar" })
  name: IActivityCategoryMeasurementType["name"]
}
