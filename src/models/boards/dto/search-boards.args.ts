import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class SearchBoardsArgs {
  @Field({ nullable: true })
  iAmAdminOf?: boolean

  @Field({ nullable: true })
  iAmMemberOf?: boolean

  @Field(() => [Int], { nullable: true })
  ids?: number[]

  @Field({ nullable: true })
  name?: string

  @Field(() => [Int], { nullable: true })
  subjectsIds?: number[]
}
