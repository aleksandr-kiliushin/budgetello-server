import { ValidationError } from "#constants/ValidationError"
import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class CreateBoardInput {
  @Field({ nullable: true })
  defaultCurrencySlug: string

  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  name: string

  @Field((type) => Int)
  subjectId: number
}
