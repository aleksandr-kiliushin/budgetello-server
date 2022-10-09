import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"

import { IActivityCategory } from "#interfaces/activities"

@Entity("activity_category")
export class ActivityCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IActivityCategory["id"]

  @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  board: BoardEntity

  @Column({ type: "varchar" })
  name: IActivityCategory["name"]

  @Column({ type: "varchar" })
  unit: IActivityCategory["unit"]
}
