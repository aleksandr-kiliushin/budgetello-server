import { Field, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateBudgetCategoryInput {
  @Field((type) => Int)
  boardId: number

  @Field()
  name: string

  @Field((type) => Int)
  typeId: number
}
