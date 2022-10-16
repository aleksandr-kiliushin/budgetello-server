import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class CreateUserInput {
  @Field()
  password: string

  @Field()
  username: string
}
