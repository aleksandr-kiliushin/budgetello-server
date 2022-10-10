import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { ActivityCategoryEntity } from "#models/activity-categories/entities/activity-category.entity"
import { UserEntity } from "#models/user/entities/user.entity"

import { IActivityRecord } from "#interfaces/activities"

@Entity("activity_record")
export class ActivityRecordEntity {
  @Column({ type: "bool", nullable: true })
  booleanValue: IActivityRecord["booleanValue"]

  @ManyToOne(() => ActivityCategoryEntity, { onDelete: "CASCADE" })
  category: ActivityCategoryEntity

  @Column({ type: "varchar" })
  comment: IActivityRecord["comment"]

  @Column({ type: "varchar" })
  date: IActivityRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IActivityRecord["id"]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  owner: UserEntity

  @Column({ type: "real", nullable: true })
  quantitativeValue: IActivityRecord["quantitativeValue"]
}
