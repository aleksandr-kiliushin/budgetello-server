import { Field, Float, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class ActivityRecord {
  @Field({ nullable: true })
  booleanValue: boolean

  // @ManyToOne(() => ActivityCategoryEntity, { onDelete: "CASCADE" })
  // category: ActivityCategoryEntity

  @Field()
  comment: string

  @Field()
  date: string

  @Field(() => Int)
  id: number

  @Field(() => Float, { nullable: true })
  quantitativeValue: number
}
