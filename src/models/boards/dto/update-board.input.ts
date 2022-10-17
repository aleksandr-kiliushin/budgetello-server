import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateBoardInput } from "./create-board.input"

@InputType()
export class UpdateBoardInput extends PartialType(CreateBoardInput) {
  @Field((type) => Int)
  id: number
}
