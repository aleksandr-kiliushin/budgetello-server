import { Field, Int, ObjectType } from "@nestjs/graphql"

import { Board } from "#models/boards/models/board.model"

@ObjectType()
export class User {
  @Field(() => [Board])
  administratedBoards: Board[]

  @Field(() => Int)
  id: number

  @Field(() => [Board])
  participatedBoards: Board[]

  @Field()
  password: string

  @Field()
  username: string
}
