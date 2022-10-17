import { Field, InputType, Int, PartialType } from "@nestjs/graphql"

import { CreateActivityCategoryInput } from "./create-activity-category.input"

@InputType()
export class UpdateActivityCategoryInput extends PartialType(CreateActivityCategoryInput) {
  @Field((type) => Int)
  id: number
}
