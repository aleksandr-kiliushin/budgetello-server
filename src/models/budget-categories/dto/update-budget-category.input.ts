import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateBudgetCategoryInput } from "./create-budget-category.input"

@InputType()
export class UpdateBudgetCategoryInput extends PartialType(CreateBudgetCategoryInput) {
  @Field((type) => Int)
  id: number
}
