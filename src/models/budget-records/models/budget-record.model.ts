import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

import { BudgetCategory } from "#models/budget-categories/models/budget-category.model"
import { Currency } from "#models/currencies/models/currency.model"
import { User } from "#models/users/models/user.model"

@ObjectType()
export class BudgetRecord {
  @Field((type) => Float)
  amount: number

  @Field((type) => User)
  author: User

  @Field((type) => BudgetCategory)
  category: BudgetCategory

  @Field()
  comment: string

  @Field((type) => Currency)
  currency: Currency

  @Field()
  date: string

  @Field((type) => Int)
  id: number

  @Field()
  isTrashed: boolean
}
