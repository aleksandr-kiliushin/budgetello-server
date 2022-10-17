import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class RemoveMemberInput {
  @Field((type) => Int)
  boardId: number

  @Field((type) => Int)
  memberId: number
}
