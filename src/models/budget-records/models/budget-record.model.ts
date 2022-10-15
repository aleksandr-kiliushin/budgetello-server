import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class BudgetRecord {
  @Field(() => Float)
  amount: number

  // @ManyToOne(() => BudgetCategoryEntity, { onDelete: "CASCADE" })
  // category: BudgetCategoryEntity

  @Field()
  date: string

  @Field()
  isTrashed: boolean

  @Field(() => Int)
  id: number
}
