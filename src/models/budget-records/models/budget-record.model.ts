import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

import { BudgetCategory } from "#models/budget-categories/models/budget-category.model"

@ObjectType()
export class BudgetRecord {
  @Field((type) => Float)
  amount: number

  @Field((type) => BudgetCategory)
  category: BudgetCategory

  @Field()
  date: string

  @Field()
  isTrashed: boolean

  @Field((type) => Int)
  id: number
}
