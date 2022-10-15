import { ArgsType, Field, Float, Int } from "@nestjs/graphql"

import { IOrdering } from "#interfaces/common"

@ArgsType()
export class SearchBudgetRecordsArgs {
  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => [Int], { nullable: true })
  boardsIds?: number[]

  @Field(() => [Int], { nullable: true })
  categoriesIds?: number[]

  @Field(() => [String], { nullable: true })
  dates?: string[]

  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field({ nullable: true })
  isTrashed?: boolean

  @Field({ nullable: true })
  orderingByDate?: IOrdering // Maybe `"ASC" | "DESC"` ?

  @Field({ nullable: true })
  orderingById?: IOrdering // Maybe `"ASC" | "DESC"` ?

  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number
}
