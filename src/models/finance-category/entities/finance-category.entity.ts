import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

import { FinanceCategoryTypeEntity } from "#models/finance-category-type/entities/finance-category-type.entity"
import { GroupEntity } from "#models/groups/entities/group.entity"

import { IFinanceCategory } from "#interfaces/finance"

@Entity("finance_category")
export class FinanceCategoryEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IFinanceCategory["id"]

  @ManyToOne(() => GroupEntity, { onDelete: "CASCADE" })
  group: GroupEntity

  @Column({ type: "varchar" })
  name: IFinanceCategory["name"]

  @ManyToOne(() => FinanceCategoryTypeEntity)
  type: FinanceCategoryTypeEntity
}
