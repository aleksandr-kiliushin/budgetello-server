import { Field, Float, InputType, Int } from "@nestjs/graphql"
import { Matches } from "class-validator"

@InputType()
export class CreateActivityRecordInput {
  @Field((type) => Boolean, { nullable: true })
  booleanValue: boolean | null

  @Field((type) => Int)
  categoryId: number

  @Field()
  comment: string

  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: string

  @Field((type) => Float, { nullable: true })
  quantitativeValue: number | null
}
