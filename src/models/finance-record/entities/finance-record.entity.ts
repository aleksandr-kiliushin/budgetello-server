import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { FinanceCategoryEntity } from "#models/finance-category/entities/finance-category.entity"

import { IFinanceRecord } from "#interfaces/finance"

@Entity("finance_record")
export class FinanceRecordEntity {
  @Column({ type: "int" })
  amount: IFinanceRecord["amount"]

  @ManyToOne(() => FinanceCategoryEntity, { onDelete: "CASCADE" })
  category: FinanceCategoryEntity

  @Column({ type: "varchar" })
  date: IFinanceRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IFinanceRecord["id"]

  @Column({ type: "bool", default: false })
  isTrashed: IFinanceRecord["isTrashed"]
}
