import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ActivityCategoryMeasurementType {
  @Field(() => Int)
  id: number

  @Field()
  name: string
}
