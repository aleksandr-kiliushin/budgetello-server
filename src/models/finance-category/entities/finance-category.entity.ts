import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { BoardEntity } from "#models/boards/entities/board.entity"
import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"

import { IFinanceCategory } from "#interfaces/finance"

@Entity("finance_category")
export class FinanceCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IFinanceCategory["id"]

  @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  board: BoardEntity

  @Column({ type: "varchar" })
  name: IFinanceCategory["name"]

  @ManyToOne(() => FinanceCategoryTypeEntity)
  type: FinanceCategoryTypeEntity
}
