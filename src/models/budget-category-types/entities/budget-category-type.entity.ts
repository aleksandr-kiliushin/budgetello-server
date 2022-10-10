import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

import { IBudgetCategoryType } from "#interfaces/budget"

@Entity("budgeting_category_type")
export class BudgetCategoryTypeEntity {
  @PrimaryGeneratedColumn({ type: "int" })
  id: IBudgetCategoryType["id"]

  @Column({ type: "varchar" })
  name: IBudgetCategoryType["name"]
}
