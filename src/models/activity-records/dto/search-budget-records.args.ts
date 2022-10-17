import { ArgsType, Field, Int } from "@nestjs/graphql"
import { IsOptional, Matches } from "class-validator"

import { IOrdering } from "#interfaces/common"

@ArgsType()
export class SearchActivityRecordsArgs {
  @Field(() => [Int], { nullable: true })
  boardsIds?: number[]

  @Field(() => [Int], { nullable: true })
  categoriesIds?: number[]

  @Field(() => [String], { nullable: true })
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { each: true, message: "An array of YYYY-MM-DD dates expected." })
  @IsOptional()
  dates?: string[]

  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field({ nullable: true })
  orderingByDate?: IOrdering // Maybe `"ASC" | "DESC"` ?

  @Field({ nullable: true })
  orderingById?: IOrdering // Maybe `"ASC" | "DESC"` ?

  @Field(() => Int, { nullable: true })
  skip?: number

  @Field(() => Int, { nullable: true })
  take?: number
}
