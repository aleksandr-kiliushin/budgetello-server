import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class UpdateUserInput {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  password?: string

  @Field({ nullable: true })
  username?: string
}
