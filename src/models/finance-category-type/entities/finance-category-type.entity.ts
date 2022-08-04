import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IFinanceCategoryType } from "#interfaces/finance"

@Entity("finance_category_type")
export class FinanceCategoryTypeEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IFinanceCategoryType["id"]

  @Column({ type: "varchar" })
  name: IFinanceCategoryType["name"]
}
