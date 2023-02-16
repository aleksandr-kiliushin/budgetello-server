import { Field, Float, InputType, Int } from "@nestjs/graphql"
import { IsPositive, Matches } from "class-validator"

@InputType()
export class CreateBudgetRecordInput {
  @Field((type) => Float)
  @IsPositive({ message: "Should be positive." })
  amount: number

  @Field((type) => Int)
  categoryId: number

  @Field()
  comment: string

  @Field()
  currencySlug: string

  @Field()
  @Matches(/^\d\d\d\d-\d\d-\d\d$/, { message: "Should have format YYYY-MM-DD." })
  date: string
}
