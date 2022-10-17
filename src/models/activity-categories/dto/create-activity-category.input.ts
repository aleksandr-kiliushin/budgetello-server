import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateActivityCategoryInput {
  @Field((type) => Int)
  boardId: number

  @Field((type) => Int)
  measurementTypeId: number

  @Field()
  name: string

  @Field((type) => String, { nullable: true })
  unit: string | null
}
