import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateActivityRecordInput } from "./create-activity-record.input"

@InputType()
export class UpdateActivityRecordInput extends PartialType(CreateActivityRecordInput) {
  @Field((type) => Int)
  id: number
}
