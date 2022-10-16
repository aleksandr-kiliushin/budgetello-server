import { Field, Int, ObjectType } from "@nestjs/graphql"

import { Board } from "#models/boards/models/board.model"
import { BudgetCategoryType } from "#models/budget-category-types/models/budget-category-type.model"

@ObjectType()
export class BudgetCategory {
  @Field(() => Board)
  board: Board

  @Field(() => Int)
  id: number

  @Field()
  name: string

  @Field(() => BudgetCategoryType)
  type: BudgetCategoryType
}
