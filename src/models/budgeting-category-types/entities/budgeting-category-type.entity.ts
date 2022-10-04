import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IBudgetingCategoryType } from "#interfaces/budgeting"

@Entity("budgeting_category_type")
export class BudgetingCategoryTypeEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetingCategoryType["id"]

  @Column({ type: "varchar" })
  name: IBudgetingCategoryType["name"]
}
