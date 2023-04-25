import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

import { ErrorMessage } from "#constants"

@InputType()
export class CreateBoardInput {
  @Field({ nullable: true })
  defaultCurrencySlug: string

  @Field()
  @IsNotEmpty({ message: ErrorMessage.REQUIRED })
  name: string

  @Field((type) => Int)
  subjectId: number
}
