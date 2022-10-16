import { Field, Int, ObjectType } from "@nestjs/graphql"

import { ActivityCategoryMeasurementType } from "#models/activity-category-measurement-types/models/activity-category-measurement-type.model"
import { Board } from "#models/boards/models/board.model"
import { User } from "#models/users/models/user.model"

@ObjectType()
export class ActivityCategory {
  @Field((type) => Board)
  board: Board

  @Field((type) => Int)
  id: number

  @Field((type) => ActivityCategoryMeasurementType)
  measurementType: ActivityCategoryMeasurementType

  @Field()
  name: string

  @Field((type) => User)
  owner: User

  @Field({ nullable: true })
  unit: string
}
