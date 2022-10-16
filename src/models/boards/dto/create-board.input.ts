import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateBoardInput {
  @Field((type) => Int)
  subjectId: number

  @Field()
  name: string
}
