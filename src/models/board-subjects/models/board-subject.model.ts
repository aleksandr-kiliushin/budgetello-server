import { Field, Int, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class BoardSubject {
  @Field(() => Int)
  id: number

  @Field()
  name: string
}
