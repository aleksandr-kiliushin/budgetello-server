import { Field, Int, ObjectType } from "@nestjs/graphql"

import { BoardSubject } from "#models/board-subjects/models/board-subject.model"
import { Currency } from "#models/currencies/models/currency.model"
import { User } from "#models/users/models/user.model"

@ObjectType()
export class Board {
  @Field(() => [User])
  admins: User[]

  @Field((type) => Currency, { nullable: true })
  defaultCurrency: Currency

  @Field((type) => Int)
  id: number

  @Field(() => [User])
  members: User[]

  @Field()
  name: string

  @Field((type) => BoardSubject)
  subject: BoardSubject
}
