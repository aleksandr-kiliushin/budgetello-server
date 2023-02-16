import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BudgetCategoryEntity } from "#models/budget-categories/entities/budget-category.entity"
import { CurrencyEntity } from "#models/currencies/entities/currency.entity"
import { UserEntity } from "#models/users/entities/user.entity"

import { IBudgetRecord } from "#interfaces/budget"

@Entity("budget_record")
export class BudgetRecordEntity {
  @Column({ type: "real" })
  amount: IBudgetRecord["amount"]

  @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  author: UserEntity

  @ManyToOne(() => BudgetCategoryEntity, { onDelete: "CASCADE" })
  category: BudgetCategoryEntity

  @ManyToOne(() => CurrencyEntity, { onDelete: "CASCADE" })
  currency: CurrencyEntity

  @Column({ type: "varchar" })
  date: IBudgetRecord["date"]

  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetRecord["id"]

  @Column({ type: "bool" })
  isTrashed: IBudgetRecord["isTrashed"]
}
