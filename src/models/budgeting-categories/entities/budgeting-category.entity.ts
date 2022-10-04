import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"
import { BudgetingCategoryTypeEntity } from "#models/budgeting-category-types/entities/budgeting-category-type.entity"

import { IBudgetingCategory } from "#interfaces/budgeting"

@Entity("budgeting_category")
export class BudgetingCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetingCategory["id"]

  @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  board: BoardEntity

  @Column({ type: "varchar" })
  name: IBudgetingCategory["name"]

  @ManyToOne(() => BudgetingCategoryTypeEntity)
  type: BudgetingCategoryTypeEntity
}
