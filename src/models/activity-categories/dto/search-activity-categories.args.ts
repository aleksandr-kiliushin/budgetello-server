import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class SearchActivityCategoriesArgs {
  @Field(() => [Int], { nullable: true })
  boardsIds?: number[]

  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field(() => [Int], { nullable: true })
  ownersIds?: number[]
}
