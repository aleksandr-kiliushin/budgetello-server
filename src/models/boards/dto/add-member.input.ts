import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class AddMemberInput {
  @Field((type) => Int)
  boardId: number

  @Field((type) => Int)
  userId: number
}
