import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateBudgetRecordInput } from "./create-budget-record.input"

@InputType()
export class UpdateBudgetRecordInput extends PartialType(CreateBudgetRecordInput) {
  @Field((type) => Int)
  id: number

  @Field({ nullable: true })
  isTrashed?: boolean
}
