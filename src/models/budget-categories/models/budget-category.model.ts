import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class BudgetCategory {
  //   @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  //   board: BoardEntity

  @Field(() => Int)
  id: number

  @Field()
  name: string

  //   @ManyToOne(() => BudgetCategoryTypeEntity)
  //   type: BudgetCategoryTypeEntity
}
