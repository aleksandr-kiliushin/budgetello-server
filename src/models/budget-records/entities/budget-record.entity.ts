import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BudgetCategoryEntity } from "#models/budget-categories/entities/budget-category.entity"

import { IBudgetRecord } from "#interfaces/budget"

@Entity("budget_record")
export class BudgetRecordEntity {
  @Column({ type: "int" })
  amount: IBudgetRecord["amount"]

  @ManyToOne(() => BudgetCategoryEntity, { onDelete: "CASCADE" })
  category: BudgetCategoryEntity

  @Column({ type: "varchar" })
  date: IBudgetRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetRecord["id"]

  @Column({ type: "bool", default: false })
  isTrashed: IBudgetRecord["isTrashed"]
}
