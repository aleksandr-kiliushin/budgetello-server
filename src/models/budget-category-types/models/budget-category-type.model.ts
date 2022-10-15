import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class BudgetCategoryType {
  @Field(() => Int)
  id: number

  @Field()
  name: string
}
