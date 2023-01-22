import { ArgsType, Field, Int } from "@nestjs/graphql"

import { IOrdering } from "#interfaces/common"

@ArgsType()
export class SearchBudgetCategoriesArgs {
  @Field(() => [Int], { nullable: true })
  boardsIds?: number[]

  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field({ nullable: true })
  orderingById?: IOrdering
}
