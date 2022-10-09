import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { ActivityCategoryMeasurementTypeEntity } from "#models/activity-category-measurement-types/entities/activity-category-measurement-type.entity"
import { BoardEntity } from "#models/boards/entities/board.entity"
import { UserEntity } from "#models/user/entities/user.entity"

import { IActivityCategory } from "#interfaces/activities"

@Entity("activity_category")
export class ActivityCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IActivityCategory["id"]

  @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  board: BoardEntity

  @ManyToOne(() => ActivityCategoryMeasurementTypeEntity)
  measurementType: ActivityCategoryMeasurementTypeEntity

  @Column({ type: "varchar" })
  name: IActivityCategory["name"]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  owner: UserEntity

  @Column({ type: "varchar", nullable: true })
  unit: IActivityCategory["unit"]
}
