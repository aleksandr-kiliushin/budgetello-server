import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class SearchBudgetCategoriesArgs {
  @Field(() => [Int], { nullable: true })
  boardsIds?: number[]

  @Field(() => [Int], { nullable: true })
  ids?: number[]
}
