import { Field, Float, InputType, Int } from "@nestjs/graphql"

@InputType()
export class CreateActivityRecordInput {
  @Field((type) => Boolean, { nullable: true })
  booleanValue: boolean | null

  @Field((type) => Int)
  categoryId: number

  @Field()
  comment: string

  @Field()
  date: string

  @Field((type) => Float, { nullable: true })
  quantitativeValue: number | null
}
