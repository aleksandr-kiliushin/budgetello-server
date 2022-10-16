import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

import { ActivityCategory } from "#models/activity-categories/models/activity-category.model"

@ObjectType()
export class ActivityRecord {
  @Field({ nullable: true })
  booleanValue: boolean

  @Field((type) => ActivityCategory)
  category: ActivityCategory

  @Field()
  comment: string

  @Field()
  date: string

  @Field((type) => Int)
  id: number

  @Field((type) => Float, { nullable: true })
  quantitativeValue: number
}
