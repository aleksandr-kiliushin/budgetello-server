import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ActivityCategory {
  //   @ManyToOne(() => BoardEntity, { onDelete: "CASCADE" })
  //   board: BoardEntity

  @Field(() => Int)
  id: number

  // @ManyToOne(() => ActivityCategoryMeasurementTypeEntity)
  // measurementType: ActivityCategoryMeasurementTypeEntity

  @Field()
  name: string

  // @ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
  // owner: UserEntity

  //   @ManyToOne(() => BudgetCategoryTypeEntity)
  //   type: BudgetCategoryTypeEntity

  @Field({ nullable: true })
  unit: string
}
