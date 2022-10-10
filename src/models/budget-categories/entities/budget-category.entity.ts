import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"
import { BudgetCategoryTypeEntity } from "#models/budget-category-types/entities/budget-category-type.entity"

import { IBudgetCategory } from "#interfaces/budget"

@Entity("budget_category")
export class BudgetCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetCategory["id"]

  @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  board: BoardEntity

  @Column({ type: "varchar" })
  name: IBudgetCategory["name"]

  @ManyToOne(() => BudgetCategoryTypeEntity)
  type: BudgetCategoryTypeEntity
}
