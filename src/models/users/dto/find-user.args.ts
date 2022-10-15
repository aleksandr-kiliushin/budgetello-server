import { ArgsType, Field, Int } from "@nestjs/graphql"

@ArgsType()
export class FindUserArgs {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field({ nullable: true })
  username?: string
}
