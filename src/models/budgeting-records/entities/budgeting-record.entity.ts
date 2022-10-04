import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BudgetingCategoryEntity } from "#models/budgeting-categories/entities/budgeting-category.entity"

import { IBudgetingRecord } from "#interfaces/budgeting"

@Entity("budgeting_record")
export class BudgetingRecordEntity {
  @Column({ type: "int" })
  amount: IBudgetingRecord["amount"]

  @ManyToOne(() => BudgetingCategoryEntity, { onDelete: "CASCADE" })
  category: BudgetingCategoryEntity

  @Column({ type: "varchar" })
  date: IBudgetingRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetingRecord["id"]

  @Column({ type: "bool", default: false })
  isTrashed: IBudgetingRecord["isTrashed"]
}
