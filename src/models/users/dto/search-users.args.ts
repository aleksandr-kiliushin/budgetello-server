import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class SearchUsersArgs {
  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field({ nullable: true })
  username?: string
}
