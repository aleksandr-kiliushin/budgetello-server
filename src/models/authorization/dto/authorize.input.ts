import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class AuthorizeInput {
  @Field()
  password: string

  @Field()
  username: string
}
