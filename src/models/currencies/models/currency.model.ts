import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class Currency {
  @Field()
  name: string

  @Field()
  slug: string

  @Field()
  symbol: string
}
