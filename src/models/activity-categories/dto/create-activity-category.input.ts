import { ValidationError } from "#constants/ValidationError"
import { Field, InputType, Int } from "@nestjs/graphql"
import { IsNotEmpty } from "class-validator"

@InputType()
export class CreateActivityCategoryInput {
  @Field((type) => Int)
  boardId: number

  @Field((type) => Int)
  measurementTypeId: number

  @Field()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  name: string

  @Field((type) => String, { nullable: true })
  unit: string | null
}
