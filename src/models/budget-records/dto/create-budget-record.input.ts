import { Field, Float, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateBudgetRecordInput {
  @Field((type) => Float)
  amount: number

  @Field((type) => Int)
  categoryId: number

  @Field()
  date: string
}
