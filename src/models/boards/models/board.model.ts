import { Field, Int, ObjectType } from "@nestjs/graphql"

import { BoardSubject } from "#models/board-subjects/models/board-subject.model"
import { User } from "#models/users/models/user.model"

@ObjectType()
export class Board {
  // @ManyToMany(() => UserEntity, (user) => user.administratedBoards, { onDelete: "CASCADE" })
  // admins: UserEntity[]

  @Field((type) => Int)
  id: number

  @Field(() => [User])
  members: User[]

  @Field()
  name: string

  @Field((type) => BoardSubject)
  subject: BoardSubject[]
}
